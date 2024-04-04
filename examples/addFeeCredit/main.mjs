import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { AddFeeCreditAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/AddFeeCreditAttributes.js';
import { AddFeeCreditPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/AddFeeCreditPayload.js';
import { FeeCreditClientMetadata } from '@alphabill/alphabill-js-sdk/lib/transaction/FeeCreditClientMetadata.js';
import { FeeCreditUnitId } from '@alphabill/alphabill-js-sdk/lib/transaction/FeeCreditUnitId.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { TransferFeeCreditAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/TransferFeeCreditAttributes.js';
import { TransferFeeCreditPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/TransferFeeCreditPayload.js';
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

const unitIds = await moneyClient.getUnitsByOwnerId(signingService.getPublicKey());
const moneyIds = unitIds.filter((id) => id.getType().toBase16() === UnitType.MONEY_PARTITION_BILL_DATA);
if (moneyIds.length === 0) {
  throw new Error('No bills available');
}

const unit = await moneyClient.getUnit(moneyIds[0], false);
const round = await moneyClient.getRoundNumber();
const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.getPublicKey()), SystemIdentifier.TOKEN_PARTITION);
const feeCreditUnit = await tokenClient.getUnit(feeCreditUnitId, false);

const transferFeeCreditTransactionHash = await moneyClient.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new TransferFeeCreditPayload(
      new TransferFeeCreditAttributes(
        100n,
        SystemIdentifier.TOKEN_PARTITION,
        feeCreditUnitId,
        round,
        round + 60n,
        feeCreditUnit.getData().getBacklink(),
        unit.getData().getBacklink(),
      ),
      SystemIdentifier.MONEY_PARTITION,
      unit.getUnitId(),
      new FeeCreditClientMetadata(5n, round + 60n),
    ),
  ),
);

let transactionProof = await waitTransactionProof(moneyClient, transferFeeCreditTransactionHash);

const addFeeCreditTransactionHash = await tokenClient.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new AddFeeCreditPayload(
      new AddFeeCreditAttributes(
        await PayToPublicKeyHashPredicate.create(cborCodec, signingService.getPublicKey()),
        transactionProof,
      ),
      SystemIdentifier.TOKEN_PARTITION,
      feeCreditUnitId,
      new FeeCreditClientMetadata(5n, round + 60n),
    ),
  ),
);

transactionProof = await waitTransactionProof(tokenClient, addFeeCreditTransactionHash);
console.log(transactionProof.toString());
