import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createMoneyClient, createTokenClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';
import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

const cborCodec = new CborCodecNode();
const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const moneyClient = createMoneyClient({
  transport: http(config.moneyPartitionUrl, cborCodec),
  transactionOrderFactory,
});

const tokenClient = createTokenClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
  transactionOrderFactory,
});

const unitIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
  (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
);
if (unitIds.length === 0) {
  throw new Error('No bills available');
}

const partitions = [
  { client: moneyClient, systemIdentifier: SystemIdentifier.MONEY_PARTITION },
  { client: tokenClient, systemIdentifier: SystemIdentifier.TOKEN_PARTITION },
];

for (const { client, systemIdentifier } of partitions) {
  const bill = await moneyClient.getUnit(unitIds[0], false);
  const round = await moneyClient.getRoundNumber();
  const feeCreditRecordId = new UnitIdWithType(
    sha256(signingService.publicKey),
    systemIdentifier === SystemIdentifier.MONEY_PARTITION
      ? UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD
      : UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD,
  );

  const feeCreditRecord = await client.getUnit(feeCreditRecordId, false);

  let transactionHash = await moneyClient.transferToFeeCredit(
    {
      bill,
      amount: 100n,
      systemIdentifier,
      feeCreditRecord: feeCreditRecord || { unitId: feeCreditRecordId },
      earliestAdditionTime: round,
      latestAdditionTime: round + 60n,
    },
    {
      maxTransactionFee: 5n,
      timeout: round + 60n,
      feeCreditRecordId: null,
    },
  );

  let proof = await waitTransactionProof(moneyClient, transactionHash);

  transactionHash = await client.addFeeCredit(
    {
      ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
      proof,
      feeCreditRecord: feeCreditRecord || { unitId: feeCreditRecordId },
    },
    {
      maxTransactionFee: 5n,
      timeout: round + 60n,
      feeCreditRecordId: null,
    },
  );

  proof = await waitTransactionProof(client, transactionHash);
  console.log(proof.toString());
}
