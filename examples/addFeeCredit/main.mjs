import { sha256 } from '@noble/hashes/sha256';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { MoneyPartitionUnitFactory } from '../../lib/json-rpc/MoneyPartitionUnitFactory.js';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { TransferFeeCreditPayload } from '../../lib/transaction/TransferFeeCreditPayload.js';
import { TransferFeeCreditAttributes } from '../../lib/transaction/TransferFeeCreditAttributes.js';
import { FeeCreditClientMetadata } from '../../lib/transaction/FeeCreditClientMetadata.js';
import { AddFeeCreditPayload } from '../../lib/transaction/AddFeeCreditPayload.js';
import { AddFeeCreditAttributes } from '../../lib/transaction/AddFeeCreditAttributes.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/PayToPublicKeyHashPredicate.js';
import { TokenPartitionUnitFactory } from '../../lib/json-rpc/TokenPartitionUnitFactory.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

import config from '../config.js';


const cborCodec = new CborCodecNode();
const moneyClient = createPublicClient({
  transport: http(config.moneyPartitionUrl, new MoneyPartitionUnitFactory(), cborCodec)
});

const tokenClient = createPublicClient({
  transport: http(config.tokenPartitionUrl, new TokenPartitionUnitFactory(), cborCodec)
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const unitIds = await moneyClient.getUnitsByOwnerId(signingService.publicKey);
const moneyIds = unitIds.filter((id) => id.getType().at(-1) === 0);
if (moneyIds.length === 0) {
  throw new Error('No bills available');
}

const unit = await moneyClient.getUnit(moneyIds[0], true);
const round = await moneyClient.getRoundNumber();
const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.publicKey), SystemIdentifier.TOKEN_PARTITION);
const feeCreditUnit = await tokenClient.getUnit(feeCreditUnitId, false);

const transferFeeCreditTransactionHash = await moneyClient.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new TransferFeeCreditPayload(
      new TransferFeeCreditAttributes(
        10000n,
        SystemIdentifier.TOKEN_PARTITION,
        feeCreditUnitId,
        round,
        round + 60n,
        feeCreditUnit?.data.backlink,
        unit.data.backlink
      ),
      SystemIdentifier.MONEY_PARTITION,
      unit.unitId,
      new FeeCreditClientMetadata(5n, round + 60n)
    )
  )
);

const transactionProof = await waitTransactionProof(moneyClient, transferFeeCreditTransactionHash);

const addFeeCreditTransactionHash = await tokenClient.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new AddFeeCreditPayload(
      new AddFeeCreditAttributes(
        await PayToPublicKeyHashPredicate.Create(cborCodec, signingService.publicKey),
        transactionProof,
      ),
      SystemIdentifier.TOKEN_PARTITION,
      feeCreditUnitId,
      new FeeCreditClientMetadata(5n, round + 60n),
    ),
  ),
);

await waitTransactionProof(tokenClient, addFeeCreditTransactionHash);
console.log(await tokenClient.getUnit(feeCreditUnitId));
