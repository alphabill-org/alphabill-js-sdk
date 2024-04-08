import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { LockFeeCreditAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/LockFeeCreditAttributes.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';
import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';
import { UnitIdWithType } from "@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js";
import { UnitType } from "@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js";
import { TransactionPayload } from "@alphabill/alphabill-js-sdk/lib/transaction/TransactionPayload.js";

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const round = await client.getRoundNumber();
const feeCreditRecordId = new UnitIdWithType(sha256(signingService.publicKey), UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD);
/**
 * @type {IUnit<FeeCreditRecord>|null}
 */
const feeCredit = await client.getUnit(feeCreditRecordId, false);
console.log('Fee credit lock status: ' + feeCredit?.data.locked);

console.log('Locking fee credit...');
const hash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    TransactionPayload.create(
      SystemIdentifier.TOKEN_PARTITION,
      feeCreditRecordId,
      new LockFeeCreditAttributes(5n, feeCredit?.data.backlink),
      SystemIdentifier.TOKEN_PARTITION,
      feeCreditRecordId,
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: null,
      },
    ),
  ),
);

await waitTransactionProof(client, hash);
/**
 * @type {IUnit<FeeCreditRecord>|null}
 */
const feeCreditAfter = await client.getUnit(feeCreditRecordId, false);
console.log('Fee credit lock status: ' + feeCreditAfter?.data.locked);
