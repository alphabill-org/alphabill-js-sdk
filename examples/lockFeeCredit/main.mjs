import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { FeeCreditClientMetadata } from '@alphabill/alphabill-js-sdk/lib/transaction/FeeCreditClientMetadata.js';
import { FeeCreditUnitId } from '@alphabill/alphabill-js-sdk/lib/transaction/FeeCreditUnitId.js';
import { LockFeeCreditAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/LockFeeCreditAttributes.js';
import { LockFeeCreditPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/LockFeeCreditPayload.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';
import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const round = await client.getRoundNumber();
const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.getPublicKey()), SystemIdentifier.TOKEN_PARTITION);
const feeCredit = await client.getUnit(feeCreditUnitId, false);
console.log('Fee credit lock status: ' + feeCredit.getData().isLocked());

console.log('Locking fee credit...');
const hash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new LockFeeCreditPayload(
      new LockFeeCreditAttributes(5n, feeCredit.getData().getBacklink()),
      SystemIdentifier.TOKEN_PARTITION,
      feeCreditUnitId,
      new FeeCreditClientMetadata(5n, round + 60n),
    ),
  ),
);

await waitTransactionProof(client, hash);
const feeCreditAfter = await client.getUnit(feeCreditUnitId, false);
console.log('Fee credit lock status: ' + feeCreditAfter.getData().isLocked());
