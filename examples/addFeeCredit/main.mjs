import { sha256 } from '@noble/hashes/sha256';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { AddFeeCreditAttributes } from '../../lib/transaction/AddFeeCreditAttributes.js';
import { AddFeeCreditPayload } from '../../lib/transaction/AddFeeCreditPayload.js';
import { FeeCreditClientMetadata } from '../../lib/transaction/FeeCreditClientMetadata.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/PayToPublicKeyHashPredicate.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { TransferFeeCreditAttributes } from '../../lib/transaction/TransferFeeCreditAttributes.js';
import { TransferFeeCreditPayload } from '../../lib/transaction/TransferFeeCreditPayload.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
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
const moneyIds = unitIds.filter((id) => id.getType().at(-1) === 0);
if (moneyIds.length === 0) {
  throw new Error('No bills available');
}

const unit = await moneyClient.getUnit(moneyIds[0], true);
const round = await moneyClient.getRoundNumber();
const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.publicKey), SystemIdentifier.TOKEN_PARTITION);
const feeCreditUnit = await tokenClient.getUnit(feeCreditUnitId, false);

const transferFeeCreditTransactionHash = await moneyClient.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new TransferFeeCreditPayload(
      new TransferFeeCreditAttributes(
        10000n,
        SystemIdentifier.TOKEN_PARTITION,
        feeCreditUnitId,
        round,
        round + 60n,
        feeCreditUnit?.data.backlink,
        unit.data.backlink,
      ),
      SystemIdentifier.MONEY_PARTITION,
      unit.unitId,
      new FeeCreditClientMetadata(5n, round + 60n),
    ),
  ),
);

let transactionProof = await waitTransactionProof(moneyClient, transferFeeCreditTransactionHash);

const addFeeCreditTransactionHash = await tokenClient.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new AddFeeCreditPayload(
      new AddFeeCreditAttributes(
        await PayToPublicKeyHashPredicate.Create(cborCodec, signingService.publicKey),
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
