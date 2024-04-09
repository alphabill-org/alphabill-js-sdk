import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { AlwaysTruePredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/AlwaysTruePredicate.js';
import { CreateNonFungibleTokenTypeAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/CreateNonFungibleTokenTypeAttributes.js';
import { TokenIcon } from '@alphabill/alphabill-js-sdk/lib/transaction/TokenIcon.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';

import config from '../config.js';
import { TransactionPayload } from "@alphabill/alphabill-js-sdk/lib/transaction/TransactionPayload.js";

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const feeCreditRecordId = new UnitIdWithType(sha256(signingService.publicKey), UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD);
const round = await client.getRoundNumber();

await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    TransactionPayload.create(
      SystemIdentifier.TOKEN_PARTITION,
      new UnitIdWithType(new Uint8Array([1, 2, 3, 25]), UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN_TYPE),
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
        feeCreditRecordId,
      },
    ),
  ),
);
