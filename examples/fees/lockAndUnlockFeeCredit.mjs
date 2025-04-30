import { FeeCreditRecord } from '../../lib/fees/FeeCreditRecord.js';
import { LockFeeCredit } from '../../lib/fees/transactions/LockFeeCredit.js';
import { UnlockFeeCredit } from '../../lib/fees/transactions/UnlockFeeCredit.js';
import { NetworkIdentifier } from '../../lib/NetworkIdentifier.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '../../lib/StateApiClientFactory.js';
import { ClientMetadata } from '../../lib/transaction/ClientMetadata.js';
import { AlwaysTruePredicate } from '../../lib/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashProofFactory } from '../../lib/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../lib/transaction/record/TransactionStatus.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
import config from '../config.js';

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const proofFactory = new PayToPublicKeyHashProofFactory(signingService);

const client = createMoneyClient({
  transport: http(config.moneyPartitionUrl),
});
const round = (await client.getRoundInfo()).roundNumber;
const feeCreditRecordId = (await client.getUnitsByOwnerId(signingService.publicKey)).feeCreditRecords.at(0);
let feeCreditRecord = await client.getUnit(feeCreditRecordId, false, FeeCreditRecord);

// anything other than 0n means locked
const lockStatus = 5n;

console.log(`Locking fee credit with ID ${feeCreditRecordId}`);
const lockFeeCreditTransactionOrder = await LockFeeCredit.create({
  status: lockStatus,
  feeCredit: feeCreditRecord,
  version: 1n,
  networkIdentifier: NetworkIdentifier.LOCAL,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, null, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory);
const lockFeeCreditHash = await client.sendTransaction(lockFeeCreditTransactionOrder);
const lockFeeCreditProof = await client.waitTransactionProof(lockFeeCreditHash, LockFeeCredit);
console.log(
  `Locking fee credit response - ${TransactionStatus[lockFeeCreditProof.transactionRecord.serverMetadata.successIndicator]}`,
);

console.log('----------------------------------------------------------------------------------------');

feeCreditRecord = await client.getUnit(feeCreditRecordId, false, FeeCreditRecord);

console.log(`Unlocking fee credit with ID ${feeCreditRecordId}, current lock status is ${feeCreditRecord.locked}`);
const unlockFeeCreditTransactionOrder = await UnlockFeeCredit.create({
  feeCredit: feeCreditRecord,
  version: 1n,
  networkIdentifier: NetworkIdentifier.LOCAL,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, null, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory);
const unlockFeeCreditHash = await client.sendTransaction(unlockFeeCreditTransactionOrder);
const unlockFeeCreditProof = await client.waitTransactionProof(unlockFeeCreditHash, UnlockFeeCredit);
console.log(
  `Unlocking fee credit response - ${TransactionStatus[unlockFeeCreditProof.transactionRecord.serverMetadata.successIndicator]}`,
);
