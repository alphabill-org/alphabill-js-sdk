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
import { UnitIdWithType } from '../../lib/transaction/UnitIdWithType.js';
import { UnitType } from '../../lib/transaction/UnitType.js';
import { NonFungibleTokenData } from '../../lib/transaction/NonFungibleTokenData.js';
import { UpdateNonFungibleTokenPayload } from '../../lib/transaction/UpdateNonFungibleTokenPayload.js';
import { UpdateNonFungibleTokenAttributes } from '../../lib/transaction/UpdateNonFungibleTokenAttributes.js';

import config from '../config.js';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.tokenPartitionUrl, new TokenPartitionUnitFactory(), cborCodec)
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.publicKey), SystemIdentifier.TOKEN_PARTITION);
const round = await client.getRoundNumber();
const unitId = new UnitIdWithType(
  new Uint8Array([1, 2, 3, 4, 5]),
  UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN,
);

const unit = await client.getUnit(unitId, false);
const data = [crypto.getRandomValues(new Uint8Array(32))];

const transactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new UpdateNonFungibleTokenPayload(
      unitId,
      new UpdateNonFungibleTokenAttributes(
        await NonFungibleTokenData.Create(cborCodec, data),
        unit?.data.backlink,
        [null, null]
      ),
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: feeCreditUnitId,
      },
    )
  ),
);
