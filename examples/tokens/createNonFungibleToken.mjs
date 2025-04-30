import { NetworkIdentifier } from '../../lib/NetworkIdentifier.js';
import { PartitionTypeIdentifier } from '../../lib/PartitionTypeIdentifier.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../lib/StateApiClientFactory.js';
import { NonFungibleTokenData } from '../../lib/tokens/NonFungibleTokenData.js';
import { TokenPartitionUnitType } from '../../lib/tokens/TokenPartitionUnitType.js';
import { CreateNonFungibleToken } from '../../lib/tokens/transactions/CreateNonFungibleToken.js';
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

// token type needs to be created before
const tokenTypeUnitId = new UnitIdWithType(new Uint8Array([1, 2, 3]), TokenPartitionUnitType.NON_FUNGIBLE_TOKEN_TYPE);

console.log(`Creating non-fungible token of type ${tokenTypeUnitId}`);
const createNonFungibleTokenTransactionOrder = await CreateNonFungibleToken.create({
  ownerPredicate: await PayToPublicKeyHashPredicate.create(signingService.publicKey),
  typeId: tokenTypeUnitId,
  name: 'My token',
  uri: 'http://guardtime.com',
  data: await NonFungibleTokenData.create(['user variables as primitives', 10000, [true, new Uint8Array()]]),
  dataUpdatePredicate: new AlwaysTruePredicate(),
  nonce: 0n,
  version: 1n,
  networkIdentifier: NetworkIdentifier.LOCAL,
  partitionIdentifier: PartitionTypeIdentifier.TOKEN,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(alwaysTrueProofFactory, proofFactory);
const createNonFungibleTokenHash = await client.sendTransaction(createNonFungibleTokenTransactionOrder);
const createNonFungibleTokenProof = await client.waitTransactionProof(
  createNonFungibleTokenHash,
  CreateNonFungibleToken,
);
console.log(
  `Create non-fungible token response - ${TransactionStatus[createNonFungibleTokenProof.transactionRecord.serverMetadata.successIndicator]}`,
);
