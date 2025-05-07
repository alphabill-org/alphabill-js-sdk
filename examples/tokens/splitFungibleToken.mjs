import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../lib/StateApiClientFactory.js';
import { FungibleToken } from '../../lib/tokens/FungibleToken.js';
import { SplitFungibleToken } from '../../lib/tokens/transactions/SplitFungibleToken.js';
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

const units = await client.getUnitsByOwnerId(signingService.publicKey);
const tokenId = units.fungibleTokens.at(0);
const feeCreditRecordId = units.feeCreditRecords.at(0);
const round = (await client.getRoundInfo()).roundNumber;
const token = await client.getUnit(tokenId, false, FungibleToken);

// in example, new token's owner is same for ease of use. change here if needed.
const newOwnerPredicate = await PayToPublicKeyHashPredicate.create(signingService.publicKey);
const splitAmount = 3n;

console.log(`Splitting fungible token with ID ${tokenId}, current value ${token.value}`);
const splitFungibleTokenTransactionOrder = await SplitFungibleToken.create({
  token: token,
  ownerPredicate: newOwnerPredicate,
  amount: splitAmount,
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
