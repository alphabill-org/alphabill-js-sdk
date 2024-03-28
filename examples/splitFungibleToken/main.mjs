import { sha256 } from '@noble/hashes/sha256';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { UnitIdWithType } from '../../lib/transaction/UnitIdWithType.js';
import { UnitType } from '../../lib/transaction/UnitType.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/PayToPublicKeyHashPredicate.js';
import { SplitFungibleTokenPayload } from '../../lib/transaction/SplitFungibleTokenPayload.js';
import { SplitFungibleTokenAttributes } from '../../lib/transaction/SplitFungibleTokenAttributes.js';
import { TokenPartitionUnitFactory } from '../../lib/json-rpc/TokenPartitionUnitFactory.js';

import config from '../config.js';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.tokenPartitionUrl, new TokenPartitionUnitFactory(), cborCodec)
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.publicKey), SystemIdentifier.TOKEN_PARTITION);
const round = await client.getRoundNumber();

// expects that the fungible token has already been created
const unitId = new UnitIdWithType(
  new Uint8Array([1, 2, 3, 4, 5]),
  UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN
);
const fungibleTokenType = new UnitIdWithType(
  new Uint8Array([1, 2, 3]),
  UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE
);
const token = await client.getUnit(unitId, false);
console.log(token);

const targetValue = 3n;
const remainingValue = token.data.value - targetValue;
const transactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new SplitFungibleTokenPayload(
      new SplitFungibleTokenAttributes(
        await PayToPublicKeyHashPredicate.Create(cborCodec, signingService.publicKey),
        targetValue,
        null,
        token.data.backlink,
        fungibleTokenType,
        remainingValue,
        [null]
      ),
      token.unitId,
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: feeCreditUnitId
      }
    )));
console.log(transactionHash);
