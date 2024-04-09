import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { AlwaysTruePredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/AlwaysTruePredicate.js';
import { CreateFungibleTokenTypeAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/CreateFungibleTokenTypeAttributes.js';
import { TokenIcon } from '@alphabill/alphabill-js-sdk/lib/transaction/TokenIcon.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { TransactionPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionPayload.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';

import config from '../config.js';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const feeCreditRecordId = new UnitIdWithType(
  sha256(signingService.publicKey),
  UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD,
);
const round = await client.getRoundNumber();

await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    TransactionPayload.create(
      SystemIdentifier.TOKEN_PARTITION,
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
        feeCreditRecordId,
      },
    ),
  ),
);
