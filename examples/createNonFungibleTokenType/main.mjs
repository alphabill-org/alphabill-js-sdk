import { sha256 } from '@noble/hashes/sha256';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { AlwaysTruePredicate } from '../../lib/transaction/AlwaysTruePredicate.js';
import { CreateNonFungibleTokenTypeAttributes } from '../../lib/transaction/CreateNonFungibleTokenTypeAttributes.js';
import { CreateNonFungibleTokenTypePayload } from '../../lib/transaction/CreateNonFungibleTokenTypePayload.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { TokenIcon } from '../../lib/transaction/TokenIcon.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { UnitIdWithType } from '../../lib/transaction/UnitIdWithType.js';
import { UnitType } from '../../lib/transaction/UnitType.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';

import config from '../config.js';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
});

const signingService = new DefaultSigningService(Base16Converter.Decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.publicKey), SystemIdentifier.TOKEN_PARTITION);
const round = await client.getRoundNumber();

await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new CreateNonFungibleTokenTypePayload(
      new UnitIdWithType(new Uint8Array([1, 2, 3]), UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN_TYPE),
      new CreateNonFungibleTokenTypeAttributes(
        'E',
        'Big money come',
        new TokenIcon('image/png', new Uint8Array()),
        null,
        new AlwaysTruePredicate(),
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
