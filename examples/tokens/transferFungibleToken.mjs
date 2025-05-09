import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../lib/StateApiClientFactory.js';
import { FungibleToken } from '../../lib/tokens/FungibleToken.js';
import { TransferFungibleToken } from '../../lib/tokens/transactions/TransferFungibleToken.js';
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
if (token === null) {
  throw new Error('Token does not exist');
}

// in example, token's new owner is same for ease of use. change here if needed.
const newOwnerPredicate = await PayToPublicKeyHashPredicate.create(signingService.publicKey);

console.log(`Transferring fungible token with ID ${tokenId}`);
const transferFungibleTokenTransactionOrder = await TransferFungibleToken.create({
  token: token,
  ownerPredicate: newOwnerPredicate,
  type: { unitId: token.typeId },
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.tokenPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, proofFactory, [alwaysTrueProofFactory]);

const transferFungibleTokenHash = await client.sendTransaction(transferFungibleTokenTransactionOrder);
const transferFungibleTokenProof = await client.waitTransactionProof(transferFungibleTokenHash, TransferFungibleToken);
console.log(
  `Transfer fungible token response - ${TransactionStatus[transferFungibleTokenProof.transactionRecord.serverMetadata.successIndicator]}`,
);
