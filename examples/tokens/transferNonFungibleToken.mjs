import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../lib/StateApiClientFactory.js';
import { NonFungibleToken } from '../../lib/tokens/NonFungibleToken.js';
import { TransferNonFungibleToken } from '../../lib/tokens/transactions/TransferNonFungibleToken.js';
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
const tokenId = units.nonFungibleTokens.at(0);
const feeCreditRecordId = units.feeCreditRecords.at(0);
const round = (await client.getRoundInfo()).roundNumber;
const token = await client.getUnit(tokenId, false, NonFungibleToken);
if (token === null) {
  throw new Error('Token does not exist');
}

console.log(`Transferring fungible token with ID ${tokenId}`);
const transferNonFungibleTokenTransactionOrder = await TransferNonFungibleToken.create({
  token: token,
  ownerPredicate: await PayToPublicKeyHashPredicate.create(signingService.publicKey),
  type: { unitId: token.typeId },
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.tokenPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, proofFactory, [alwaysTrueProofFactory]);
const transferNonFungibleTokenHash = await client.sendTransaction(transferNonFungibleTokenTransactionOrder);
const transferNonFungibleTokenProof = await client.waitTransactionProof(
  transferNonFungibleTokenHash,
  TransferNonFungibleToken,
);
console.log(
  `Transfer non-fungible token response - ${TransactionStatus[transferNonFungibleTokenProof.transactionRecord.serverMetadata.successIndicator]}`,
);
