import { sha256 } from '@noble/hashes/sha256';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { LockFeeCreditPayload } from '../../lib/transaction/LockFeeCreditPayload.js';
import { LockFeeCreditAttributes } from '../../lib/transaction/LockFeeCreditAttributes.js';
import { TokenPartitionUnitFactory } from '../../lib/json-rpc/TokenPartitionUnitFactory.js';
import { FeeCreditClientMetadata } from "../../lib/transaction/FeeCreditClientMetadata.js";

import config from '../config.js';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.tokenPartitionUrl, new TokenPartitionUnitFactory(), cborCodec)
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const round = await client.getRoundNumber();
const feeCreditUnitId = new FeeCreditUnitId(
  sha256(signingService.publicKey),
  SystemIdentifier.TOKEN_PARTITION
);
const feeCredit = await client.getUnit(feeCreditUnitId, false);

const hash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new LockFeeCreditPayload(
      new LockFeeCreditAttributes(
        5n,
        feeCredit.data.backlink,
      ),
      feeCredit.unitId,
      new FeeCreditClientMetadata(5n, round + 60n)
    )
  )
);
console.log(hash);
const feeCreditAfter = await client.getUnit(feeCreditUnitId, false);
console.log(feeCreditAfter.data.locked)
