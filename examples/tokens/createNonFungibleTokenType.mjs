import { NetworkIdentifier } from '../../lib/NetworkIdentifier.js';
import { PartitionTypeIdentifier } from '../../lib/PartitionTypeIdentifier.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../lib/StateApiClientFactory.js';
import { TokenPartitionUnitType } from '../../lib/tokens/TokenPartitionUnitType.js';
import { CreateNonFungibleTokenType } from '../../lib/tokens/transactions/CreateNonFungibleTokenType.js';
import { UnitIdWithType } from '../../lib/tokens/UnitIdWithType.js';
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

const feeCreditRecordId = (await client.getUnitsByOwnerId(signingService.publicKey)).feeCreditRecords.at(0);
const round = (await client.getRoundInfo()).roundNumber;
const tokenTypeUnitId = new UnitIdWithType(new Uint8Array([1, 2, 3]), TokenPartitionUnitType.NON_FUNGIBLE_TOKEN_TYPE);

console.log(`Creating non-fungible token type with unit ID ${tokenTypeUnitId}`);

const createNonFungibleTokenTypeTransactionOrder = await CreateNonFungibleTokenType.create({
  typeId: tokenTypeUnitId,
  symbol: 'E',
  name: 'Token Name',
  icon: { type: 'image/png', data: new Uint8Array() },
  parentTypeId: null,
  subTypeCreationPredicate: new AlwaysTruePredicate(),
  tokenMintingPredicate: new AlwaysTruePredicate(),
  tokenTypeOwnerPredicate: new AlwaysTruePredicate(),
  dataUpdatePredicate: new AlwaysTruePredicate(),
  version: 1n,
  networkIdentifier: NetworkIdentifier.LOCAL,
  partitionIdentifier: PartitionTypeIdentifier.TOKEN,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, []);
const createNonFungibleTokenTypeHash = await client.sendTransaction(createNonFungibleTokenTypeTransactionOrder);
const createNonFungibleTokenTypeProof = await client.waitTransactionProof(
  createNonFungibleTokenTypeHash,
  CreateNonFungibleTokenType,
);
console.log(
  `Create non-fungible token type response - ${TransactionStatus[createNonFungibleTokenTypeProof.transactionRecord.serverMetadata.successIndicator]}`,
);
