import { sha256 } from '@noble/hashes/sha256';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/PayToPublicKeyHashPredicate.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { TransferNonFungibleTokenAttributes } from '../../lib/transaction/TransferNonFungibleTokenAttributes.js';
import { TransferNonFungibleTokenPayload } from '../../lib/transaction/TransferNonFungibleTokenPayload.js';
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
const unitId = new UnitIdWithType(new Uint8Array([1, 2, 3, 4, 5]), UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN);

const token = await client.getUnit(unitId, false);
if (token === null) {
  throw new Error('Token does not exist');
}

await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new TransferNonFungibleTokenPayload(
      unitId,
      new TransferNonFungibleTokenAttributes(
        await PayToPublicKeyHashPredicate.Create(cborCodec, signingService.publicKey),
        null,
        token.data.backlink,
        new UnitIdWithType(new Uint8Array([1, 2, 3]), UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN_TYPE),
        [null],
      ),
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: feeCreditUnitId,
      },
    ),
  ),
);
