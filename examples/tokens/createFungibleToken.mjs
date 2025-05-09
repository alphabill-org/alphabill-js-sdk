import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../lib/StateApiClientFactory.js';
import { TokenPartitionUnitType } from '../../lib/tokens/TokenPartitionUnitType.js';
import { CreateFungibleToken } from '../../lib/tokens/transactions/CreateFungibleToken.js';
import { UnitIdWithType } from '../../lib/tokens/UnitIdWithType.js';
import { ClientMetadata } from '../../lib/transaction/ClientMetadata.js';
import { AlwaysTruePredicate } from '../../lib/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { AlwaysTrueProofFactory } from '../../lib/transaction/proofs/AlwaysTrueProofFactory.js';
import { PayToPublicKeyHashProofFactory } from '../../lib/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../lib/transaction/record/TransactionStatus.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';

import config from '../config.js';

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const proofFactory = new PayToPublicKeyHashProofFactory(signingService);
const alwaysTrueProofFactory = new AlwaysTrueProofFactory();

const client = createTokenClient({
  transport: http(config.tokenPartitionUrl),
});

const feeCreditRecordId = (await client.getUnitsByOwnerId(signingService.publicKey)).feeCreditRecords.at(0);
const round = (await client.getRoundInfo()).roundNumber;
const tokenTypeUnitId = new UnitIdWithType(new Uint8Array([1, 2, 3]), TokenPartitionUnitType.FUNGIBLE_TOKEN_TYPE);

console.log(`Creating fungible token of type ${tokenTypeUnitId}`);
const createFungibleTokenTransactionOrder = await CreateFungibleToken.create({
  ownerPredicate: await PayToPublicKeyHashPredicate.create(signingService.publicKey),
  typeId: tokenTypeUnitId,
  value: 10n,
  nonce: 0n,
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.tokenPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(alwaysTrueProofFactory, proofFactory);
const createFungibleTokenHash = await client.sendTransaction(createFungibleTokenTransactionOrder);
const createFungibleTokenProof = await client.waitTransactionProof(createFungibleTokenHash, CreateFungibleToken);
console.log(
  `Create fungible token response - ${TransactionStatus[createFungibleTokenProof.transactionRecord.serverMetadata.successIndicator]}`,
);
