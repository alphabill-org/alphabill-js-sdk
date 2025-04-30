import { SetFeeCredit } from '../../lib/fees/transactions/SetFeeCredit.js';
import { NetworkIdentifier } from '../../lib/NetworkIdentifier.js';
import { PartitionTypeIdentifier } from '../../lib/PartitionTypeIdentifier.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../lib/StateApiClientFactory.js';
import { ClientMetadata } from '../../lib/transaction/ClientMetadata.js';
import { AlwaysTruePredicate } from '../../lib/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { PayToPublicKeyHashProofFactory } from '../../lib/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../lib/transaction/record/TransactionStatus.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
import config from '../../config.js';

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const proofFactory = new PayToPublicKeyHashProofFactory(signingService);

const client = createTokenClient({
  transport: http(config.tokenPartitionUrl),
});
const round = (await client.getRoundInfo()).roundNumber;

const feeCreditAmount = 100n;
const feeCreditOwnerPredicate = await PayToPublicKeyHashPredicate.create(signingService.publicKey);
const partitionTypeIdentifier = PartitionTypeIdentifier.TOKEN;

// if following variables are null, a new fee credit record is created.
// in order to use existing fee credit record, use these variables.
const fcrId = null;
const fcrCounter = null;

if (fcrId == null && fcrCounter == null) {
  console.log('Creating new fee credit record');
} else {
  console.log(`Using fee credit record with ID ${fcrId}`);
}

console.log(`Setting ${feeCreditAmount} fee credit to partition ID ${partitionTypeIdentifier}`);
const setFeeCreditTransactionOrder = await SetFeeCredit.create({
  targetPartitionIdentifier: partitionTypeIdentifier,
  ownerPredicate: feeCreditOwnerPredicate,
  amount: feeCreditAmount,
  feeCreditRecord: { unitId: fcrId, counter: fcrCounter },
  version: 1n,
  networkIdentifier: NetworkIdentifier.LOCAL,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, null, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory);
const setFeeCreditHash = await client.sendTransaction(setFeeCreditTransactionOrder);
const setFeeCreditProof = await client.waitTransactionProof(setFeeCreditHash, SetFeeCredit);
console.log(
  `Set fee credit response - ${TransactionStatus[setFeeCreditProof.transactionRecord.serverMetadata.successIndicator]}`,
);
