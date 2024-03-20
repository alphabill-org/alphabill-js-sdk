import { sha256 } from '@noble/hashes/sha256';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { TokenPartitionUnitFactory } from '../../lib/json-rpc/TokenPartitionUnitFactory.js';
import { CreateFungibleTokenTypePayload } from '../../lib/transaction/CreateFungibleTokenTypePayload.js';
import { UnitIdWithType } from '../../lib/transaction/UnitIdWithType.js';
import { CreateFungibleTokenTypeAttributes } from "../../lib/transaction/CreateFungibleTokenTypeAttributes.js";
import { TokenIcon } from '../../lib/transaction/TokenIcon.js';
import { AlwaysTruePredicate } from '../../lib/transaction/AlwaysTruePredicate.js';
import { UnitType } from '../../lib/transaction/UnitType.js';

import config from '../config.js';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.tokenPartitionUrl, new TokenPartitionUnitFactory(), cborCodec)
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.publicKey), SystemIdentifier.TOKEN_PARTITION);
const round = await client.getRoundNumber();

await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new CreateFungibleTokenTypePayload(
      new UnitIdWithType(new Uint8Array([1, 2, 3]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE),
      new CreateFungibleTokenTypeAttributes(
        'E',
        'Big money come',
        new TokenIcon('image/png', new Uint8Array()),
        null,
        8,
        new AlwaysTruePredicate(),
        new AlwaysTruePredicate(),
        new AlwaysTruePredicate(),
        null,
      ),
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: feeCreditUnitId,
      },
    ),
  ),
);

