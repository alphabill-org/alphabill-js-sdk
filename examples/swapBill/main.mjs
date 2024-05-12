import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
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

const client = createMoneyClient({
  transport: http(config.moneyPartitionUrl, new CborCodecNode()),
  transactionOrderFactory,
});

const unitIds = await client.getUnitsByOwnerId(signingService.publicKey);
const targetUnitIdHex = '0x000000000000000000000000000000000000000000000000000000000000000100';
const targetUnitId = new UnitIdWithType(
  new Uint8Array(Base16Converter.decode(targetUnitIdHex)),
  UnitType.MONEY_PARTITION_BILL_DATA,
);
const moneyUnitId = unitIds
  .filter(
    (id) =>
      id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA && Base16Converter.encode(id.bytes) !== targetUnitIdHex,
  )
  .at(0);

if (!moneyUnitId) {
  throw new Error('No bills available');
}

/**
 * @type {Bill|null}
 */
const targetBill = await client.getUnit(targetUnitId, false);
/**
 * @type {Bill|null}
 */
const bill = await client.getUnit(moneyUnitId, false);
const feeCreditRecordId = new UnitIdWithType(
  sha256(signingService.publicKey),
  UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD,
);
const round = await client.getRoundNumber();

const transactionHash = await client.transferBillToDustCollector(
  {
    bill,
    targetBill,
  },
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId,
  },
);

const transactionProof = await waitTransactionProof(client, transactionHash);

await client.swapBillsWithDustCollector(
  {
    bill: targetBill,
    ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
    proofs: [transactionProof],
  },
  {
    maxTransactionFee: 5n,
    timeout: round + 100n,
    feeCreditRecordId,
  },
);
