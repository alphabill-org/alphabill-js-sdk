import { DefaultSigningService } from '../../src/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../src/StateApiClientFactory.js';
import { FungibleToken } from '../../src/tokens/FungibleToken.js';
import { BurnFungibleToken } from '../../src/tokens/transactions/BurnFungibleToken.js';
import { JoinFungibleToken } from '../../src/tokens/transactions/JoinFungibleToken.js';
import { SplitFungibleToken } from '../../src/tokens/transactions/SplitFungibleToken.js';
import { ClientMetadata } from '../../src/transaction/ClientMetadata.js';
import { AlwaysTruePredicate } from '../../src/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../src/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { AlwaysTrueProofFactory } from '../../src/transaction/proofs/AlwaysTrueProofFactory.js';
import { PayToPublicKeyHashProofFactory } from '../../src/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../src/transaction/record/TransactionStatus.js';
import { UnitId } from '../../src/UnitId.js';
import { Base16Converter } from '../../src/util/Base16Converter.js';
import config from '../config.js';

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const proofFactory = new PayToPublicKeyHashProofFactory(signingService);
const alwaysTrueProofFactory = new AlwaysTrueProofFactory();

const client = createTokenClient({
  transport: http(config.tokenPartitionUrl),
});

const units = await client.getUnitsByOwnerId(signingService.publicKey);
const tokenId = units.fungibleTokens.at(0);
const feeCreditRecordId = units.feeCreditRecords.at(0);
const round = (await client.getRoundInfo()).roundNumber;
let token = await client.getUnit(tokenId, false, FungibleToken);

console.log(`Splitting fungible token with ID ${tokenId} and value ${token.value}`);
const splitFungibleTokenTransactionOrder = await SplitFungibleToken.create({
  token: token,
  ownerPredicate: await PayToPublicKeyHashPredicate.create(signingService.publicKey),
  amount: 1n,
  type: { unitId: token.typeId },
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.tokenPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, proofFactory, [alwaysTrueProofFactory]);
const splitFungibleTokenHash = await client.sendTransaction(splitFungibleTokenTransactionOrder);
const splitFungibleTokenProof = await client.waitTransactionProof(splitFungibleTokenHash, SplitFungibleToken);
console.log(
  `Split fungible token response - ${TransactionStatus[splitFungibleTokenProof.transactionRecord.serverMetadata.successIndicator]}`,
);

console.log('----------------------------------------------------------------------------------------');

const splitTokenId = splitFungibleTokenProof.transactionRecord.serverMetadata.targetUnitIds.find(
  (id) => !UnitId.equals(id, token.unitId),
);
const splitToken = await client.getUnit(splitTokenId, false, FungibleToken);
console.log(`Found split token with ID ${splitTokenId} and value ${splitToken.value}`);

token = await client.getUnit(tokenId, false, FungibleToken);

console.log(`Burning fungible token with ID ${splitTokenId}`);
const burnFungibleTokenTransactionOrder = await BurnFungibleToken.create({
  type: { unitId: splitToken.typeId },
  token: splitToken,
  targetToken: token,
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.tokenPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, proofFactory, [alwaysTrueProofFactory]);
const burnFungibleTokenHash = await client.sendTransaction(burnFungibleTokenTransactionOrder);
const burnFungibleTokenProof = await client.waitTransactionProof(burnFungibleTokenHash, BurnFungibleToken);
console.log(
  `Burn fungible token response - ${TransactionStatus[burnFungibleTokenProof.transactionRecord.serverMetadata.successIndicator]}`,
);

console.log('----------------------------------------------------------------------------------------');

console.log(`Joining fungible token with ID ${splitTokenId} into original token with ID ${tokenId}`);
const joinFungibleTokenTransactionOrder = await JoinFungibleToken.create({
  token: token,
  proofs: [burnFungibleTokenProof],
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.tokenPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, proofFactory, [alwaysTrueProofFactory]);
const joinFungibleTokenHash = await client.sendTransaction(joinFungibleTokenTransactionOrder);
const joinFungibleTokenProof = await client.waitTransactionProof(joinFungibleTokenHash, JoinFungibleToken);
console.log(
  `Join fungible token response - ${TransactionStatus[joinFungibleTokenProof.transactionRecord.serverMetadata.successIndicator]}`,
);
