import { sha256 } from '@noble/hashes/sha256';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { FeeCreditClientMetadata } from '../../lib/transaction/FeeCreditClientMetadata.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { LockFeeCreditAttributes } from '../../lib/transaction/LockFeeCreditAttributes.js';
import { LockFeeCreditPayload } from '../../lib/transaction/LockFeeCreditPayload.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
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
console.log('Fee credit lock status: ' + feeCredit.data.locked);

console.log('Locking fee credit...');
const hash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new LockFeeCreditPayload(
      new LockFeeCreditAttributes(5n, feeCredit.data.backlink),
      SystemIdentifier.TOKEN_PARTITION,
      feeCreditUnitId,
      new FeeCreditClientMetadata(5n, round + 60n),
    ),
  ),
);

await waitTransactionProof(client, hash);
const feeCreditAfter = await client.getUnit(feeCreditUnitId, false);
console.log('Fee credit lock status: ' + feeCreditAfter.data.locked);
