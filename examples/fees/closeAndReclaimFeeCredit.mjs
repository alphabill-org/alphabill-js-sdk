import { FeeCreditRecord } from '../../src/fees/FeeCreditRecord.js';
import { CloseFeeCredit } from '../../src/fees/transactions/CloseFeeCredit.js';
import { ReclaimFeeCredit } from '../../src/fees/transactions/ReclaimFeeCredit.js';
import { Bill } from '../../src/money/Bill.js';
import { DefaultSigningService } from '../../src/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '../../src/StateApiClientFactory.js';
import { ClientMetadata } from '../../src/transaction/ClientMetadata.js';
import { AlwaysTruePredicate } from '../../src/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashProofFactory } from '../../src/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../src/transaction/record/TransactionStatus.js';
import { Base16Converter } from '../../src/util/Base16Converter.js';
import config from '../config.js';

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const proofFactory = new PayToPublicKeyHashProofFactory(signingService);

const client = createMoneyClient({
  transport: http(config.moneyPartitionUrl),
});

const units = await client.getUnitsByOwnerId(signingService.publicKey);
const targetBillId = units.bills.at(0);
const feeCreditRecordId = units.feeCreditRecords.at(0);
if (!feeCreditRecordId) {
  throw new Error('No fee credit available');
}

const bill = await client.getUnit(targetBillId, false, Bill);
const feeCreditRecord = await client.getUnit(feeCreditRecordId, false, FeeCreditRecord);
const round = (await client.getRoundInfo()).roundNumber;

console.log(`Closing fee credit with ID ${feeCreditRecordId}`);
const closeFeeCreditTransactionOrder = await CloseFeeCredit.create({
  bill: bill,
  feeCreditRecord: feeCreditRecord,
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.moneyPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, null, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory);
const closeFeeCreditHash = await client.sendTransaction(closeFeeCreditTransactionOrder);
const closeFeeCreditProof = await client.waitTransactionProof(closeFeeCreditHash, CloseFeeCredit);
console.log(
  `Closing fee credit response - ${TransactionStatus[closeFeeCreditProof.transactionRecord.serverMetadata.successIndicator]}`,
);

console.log('----------------------------------------------------------------------------------------');

console.log(`Reclaiming fee credit with ID ${feeCreditRecordId}`);
const reclaimFeeCreditTransactionOrder = await ReclaimFeeCredit.create({
  proof: closeFeeCreditProof,
  bill: bill,
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.moneyPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, null, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory);
const reclaimFeeCreditHash = await client.sendTransaction(reclaimFeeCreditTransactionOrder);
const reclaimFeeCreditProof = await client.waitTransactionProof(reclaimFeeCreditHash, ReclaimFeeCredit);
console.log(
  `Reclaiming fee credit response - ${TransactionStatus[reclaimFeeCreditProof.transactionRecord.serverMetadata.successIndicator]}`,
);
