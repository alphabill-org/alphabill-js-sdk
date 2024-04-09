import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { TransactionPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionPayload.js';
import { TransferFungibleTokenAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/TransferFungibleTokenAttributes.js';
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
const unitId = new UnitIdWithType(new Uint8Array([1, 2, 3, 4, 5]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN);

/**
 * @type {IUnit<FungibleToken>|null}
 */
const token = await client.getUnit(unitId, false);
if (token === null) {
  throw new Error('Token does not exist');
}

await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    TransactionPayload.create(
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      new TransferFungibleTokenAttributes(
        await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
        token?.data.value,
        null,
        token?.data.backlink,
        new UnitIdWithType(new Uint8Array([1, 2, 3]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE),
        [null],
      ),
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: feeCreditRecordId,
      },
    ),
  ),
);
