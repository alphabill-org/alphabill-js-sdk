import crypto from 'crypto';
import { DefaultSigningService } from '../../src/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../src/StateApiClientFactory.js';
import { NonFungibleToken } from '../../src/tokens/NonFungibleToken.js';
import { NonFungibleTokenData } from '../../src/tokens/NonFungibleTokenData.js';
import { UpdateNonFungibleToken } from '../../src/tokens/transactions/UpdateNonFungibleToken.js';
import { ClientMetadata } from '../../src/transaction/ClientMetadata.js';
import { AlwaysTruePredicate } from '../../src/transaction/predicates/AlwaysTruePredicate.js';
import { AlwaysTrueProofFactory } from '../../src/transaction/proofs/AlwaysTrueProofFactory.js';
import { PayToPublicKeyHashProofFactory } from '../../src/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../src/transaction/record/TransactionStatus.js';
import { Base16Converter } from '../../src/util/Base16Converter.js';

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

const newData = await NonFungibleTokenData.create(crypto.getRandomValues(new Uint8Array(32)));

console.log(`Updating data for token with ID ${tokenId}`);
const updateNonFungibleTokenTransactionOrder = await UpdateNonFungibleToken.create({
  token: token,
  data: newData,
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.tokenPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(alwaysTrueProofFactory, proofFactory, [alwaysTrueProofFactory]);
const updateNonFungibleTokenHash = await client.sendTransaction(updateNonFungibleTokenTransactionOrder);
const updateNonFungibleTokenProof = await client.waitTransactionProof(
  updateNonFungibleTokenHash,
  UpdateNonFungibleToken,
);
console.log(
  `Update non-fungible token response - ${TransactionStatus[updateNonFungibleTokenProof.transactionRecord.serverMetadata.successIndicator]}`,
);
