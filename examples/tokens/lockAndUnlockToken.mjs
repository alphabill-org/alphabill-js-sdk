import { NetworkIdentifier } from '../../lib/NetworkIdentifier.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../lib/StateApiClientFactory.js';
import { FungibleToken } from '../../lib/tokens/FungibleToken.js';
import { LockToken } from '../../lib/tokens/transactions/LockToken.js';
import { UnlockToken } from '../../lib/tokens/transactions/UnlockToken.js';
import { ClientMetadata } from '../../lib/transaction/ClientMetadata.js';
import { AlwaysTruePredicate } from '../../lib/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashProofFactory } from '../../lib/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../lib/transaction/record/TransactionStatus.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';

import config from '../config.js';

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const proofFactory = new PayToPublicKeyHashProofFactory(signingService);

const client = createTokenClient({
  transport: http(config.tokenPartitionUrl),
});

const units = await client.getUnitsByOwnerId(signingService.publicKey);
const tokenId = units.fungibleTokens.at(0);
const feeCreditRecordId = units.feeCreditRecords.at(0);
const round = (await client.getRoundInfo()).roundNumber;
let token = await client.getUnit(tokenId, false, FungibleToken);

const lockStatus = 5n;

console.log(`Locking fungible token with ID ${tokenId}`);
const lockFungibleTokenTransactionOrder = await LockToken.create({
  status: lockStatus,
  token: token,
  version: 1n,
  networkIdentifier: NetworkIdentifier.LOCAL,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, proofFactory);
const lockFungibleTokenHash = await client.sendTransaction(lockFungibleTokenTransactionOrder);
const lockFungibleTokenProof = await client.waitTransactionProof(lockFungibleTokenHash, LockToken);
console.log(
  `Lock fungible token response - ${TransactionStatus[lockFungibleTokenProof.transactionRecord.serverMetadata.successIndicator]}`,
);

console.log('----------------------------------------------------------------------------------------');

token = await client.getUnit(tokenId, false, FungibleToken);

console.log(`Unlocking fungible token with ID ${tokenId}, current lock status is ${token.locked}`);
const unlockFungibleTokenTransactionOrder = await UnlockToken.create({
  token: {
    unitId: token.unitId,
    counter: token.counter,
  },
  version: 1n,
  networkIdentifier: NetworkIdentifier.LOCAL,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, proofFactory);
const unlockFungibleTokenHash = await client.sendTransaction(unlockFungibleTokenTransactionOrder);
const unlockFungibleTokenProof = await client.waitTransactionProof(unlockFungibleTokenHash, UnlockToken);
console.log(
  `Unlock fungible token response - ${TransactionStatus[unlockFungibleTokenProof.transactionRecord.serverMetadata.successIndicator]}`,
);
