import { NetworkIdentifier } from '../../lib/NetworkIdentifier.js';
import { PartitionTypeIdentifier } from '../../lib/PartitionTypeIdentifier.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../lib/StateApiClientFactory.js';
import { TokenIcon } from '../../lib/tokens/TokenIcon.js';
import { TokenPartitionUnitType } from '../../lib/tokens/TokenPartitionUnitType.js';
import { CreateFungibleTokenType } from '../../lib/tokens/transactions/CreateFungibleTokenType.js';
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
const tokenTypeUnitId = new UnitIdWithType(new Uint8Array([1, 2, 3]), TokenPartitionUnitType.FUNGIBLE_TOKEN_TYPE);

console.log(`Creating fungible token type with unit ID ${tokenTypeUnitId}`);
const createFungibleTokenTypeTransactionOrder = await CreateFungibleTokenType.create({
  type: { unitId: tokenTypeUnitId },
  symbol: 'E',
  name: 'Big money come',
  icon: new TokenIcon('image/png', new Uint8Array()),
  parentTypeId: null,
  decimalPlaces: 8,
  subTypeCreationPredicate: new AlwaysTruePredicate(),
  tokenMintingPredicate: new AlwaysTruePredicate(),
  tokenTypeOwnerPredicate: new AlwaysTruePredicate(),
  version: 1n,
  networkIdentifier: NetworkIdentifier.LOCAL,
  partitionIdentifier: PartitionTypeIdentifier.TOKEN,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, []);
const createFungibleTokenTypeHash = await client.sendTransaction(createFungibleTokenTypeTransactionOrder);
const createFungibleTokenTypeProof = await client.waitTransactionProof(
  createFungibleTokenTypeHash,
  CreateFungibleTokenType,
);
console.log(
  `Create fungible token type response - ${TransactionStatus[createFungibleTokenTypeProof.transactionRecord.serverMetadata.successIndicator]}`,
);
