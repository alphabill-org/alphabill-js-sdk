import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { FeeCreditUnitId } from '@alphabill/alphabill-js-sdk/lib/transaction/FeeCreditUnitId.js';
import { LockBillAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/LockBillAttributes.js';
import { LockBillPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/LockBillPayload.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';

import config from '../config.js';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.moneyPartitionUrl, cborCodec),
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const unitIdBytes = new Uint8Array(32);
unitIdBytes.set([0x01], 31);

const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.getPublicKey()), SystemIdentifier.MONEY_PARTITION);
const round = await client.getRoundNumber();

const bill = await client.getUnit(new UnitIdWithType(unitIdBytes, UnitType.MONEY_PARTITION_BILL_DATA), false);

const payload = new LockBillPayload(new LockBillAttributes(5n, bill.getData().getBacklink()), bill.getUnitId(), {
  maxTransactionFee: 5n,
  timeout: round + 60n,
  feeCreditRecordId: feeCreditUnitId,
});

const hash = await client.sendTransaction(await transactionOrderFactory.createTransaction(payload));
console.log(hash);
