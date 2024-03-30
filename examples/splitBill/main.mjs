import { sha256 } from '@noble/hashes/sha256';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { MoneyPartitionUnitFactory } from '../../lib/json-rpc/MoneyPartitionUnitFactory.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/PayToPublicKeyHashPredicate.js';
import { SplitBillAttributes } from '../../lib/transaction/SplitBillAttributes.js';
import { SplitBillPayload } from '../../lib/transaction/SplitBillPayload.js';
import { SplitBillUnit } from '../../lib/transaction/SplitBillUnit.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { UnitIdWithType } from '../../lib/transaction/UnitIdWithType.js';
import { UnitType } from '../../lib/transaction/UnitType.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';

import config from '../config.js';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.moneyPartitionUrl, new MoneyPartitionUnitFactory(), cborCodec),
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const unitIdBytes = new Uint8Array(32);
unitIdBytes.set([0x01], 31);

const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.publicKey), SystemIdentifier.MONEY_PARTITION);
const round = await client.getRoundNumber();

const bill = await client.getUnit(new UnitIdWithType(unitIdBytes, UnitType.MONEY_PARTITION_BILL_DATA), false);

const payload = new SplitBillPayload(
  new SplitBillAttributes(
    [
      new SplitBillUnit(10000n, await PayToPublicKeyHashPredicate.Create(cborCodec, signingService.publicKey)),
      new SplitBillUnit(10000n, await PayToPublicKeyHashPredicate.Create(cborCodec, signingService.publicKey)),
    ],
    bill.data.value - 20000n,
    bill.data.backlink,
  ),
  bill.unitId,
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId: feeCreditUnitId,
  },
);

const hash = await client.sendTransaction(await transactionOrderFactory.createTransaction(payload));
console.log(hash);
