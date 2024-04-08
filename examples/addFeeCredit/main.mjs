import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { AddFeeCreditAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/AddFeeCreditAttributes.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { TransactionPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionPayload.js';
import { TransferFeeCreditAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/TransferFeeCreditAttributes.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';
import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

const cborCodec = new CborCodecNode();
const moneyClient = createPublicClient({
  transport: http(config.moneyPartitionUrl, cborCodec),
});

const tokenClient = createPublicClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const unitIds = await moneyClient.getUnitsByOwnerId(signingService.publicKey);
const moneyIds = unitIds.filter((id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA);
if (moneyIds.length === 0) {
  throw new Error('No bills available');
}

const unit = await moneyClient.getUnit(moneyIds[0], false);
const round = await moneyClient.getRoundNumber();
const feeCreditRecordId = new UnitIdWithType(
  sha256(signingService.publicKey),
  UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD,
);
const feeCreditUnit = await tokenClient.getUnit(feeCreditRecordId, false);

const transferFeeCreditTransactionHash = await moneyClient.sendTransaction(
  await transactionOrderFactory.createTransaction(
    TransactionPayload.create(
      SystemIdentifier.MONEY_PARTITION,
      unit.unitId,
      new TransferFeeCreditAttributes(
        100n,
        SystemIdentifier.TOKEN_PARTITION,
        feeCreditRecordId,
        round,
        round + 60n,
        feeCreditUnit?.data.backlink || null,
        unit.data.backlink,
      ),
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: null
      },
    ),
  ),
);

let transactionProof = await waitTransactionProof(moneyClient, transferFeeCreditTransactionHash);

const addFeeCreditTransactionHash = await tokenClient.sendTransaction(
  await transactionOrderFactory.createTransaction(
    TransactionPayload.create(
      SystemIdentifier.TOKEN_PARTITION,
      feeCreditRecordId,
      new AddFeeCreditAttributes(
        await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
        transactionProof,
      ),
      {
        maxTransactionFee: 5n,
        timeout: round + 100n,
        feeCreditRecordId: null
      },
    ),
  ),
);

transactionProof = await waitTransactionProof(tokenClient, addFeeCreditTransactionHash);
console.log(transactionProof.toString());
