import { Bill } from '../../lib/money/Bill.js';
import { LockBill } from '../../lib/money/transactions/LockBill.js';
import { UnlockBill } from '../../lib/money/transactions/UnlockBill.js';
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

const units = await client.getUnitsByOwnerId(signingService.publicKey);
const billId = units.bills.at(0);
const feeCreditRecordId = units.feeCreditRecords.at(0);
const round = (await client.getRoundInfo()).roundNumber;
let bill = await client.getUnit(billId, false, Bill);

// anything other than 0n means locked
const lockStatus = 5n;

console.log(`Locking bill with ID ${bill.unitId}`);
const lockBillTransactionOrder = await LockBill.create({
  status: lockStatus,
  bill: bill,
  version: 1n,
  networkIdentifier: NetworkIdentifier.LOCAL,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, proofFactory);

const lockBillHash = await client.sendTransaction(lockBillTransactionOrder);
const lockBillProof = await client.waitTransactionProof(lockBillHash, LockBill);
console.log(
  `Lock bill response - ${TransactionStatus[lockBillProof.transactionRecord.serverMetadata.successIndicator]}`,
);

console.log('----------------------------------------------------------------------------------------');

bill = await client.getUnit(billId, false, Bill);

console.log(`Unlocking bill with ID ${bill.unitId}, current lock status is ${bill.locked}`);
const unlockBillTransactionOrder = await UnlockBill.create({
  bill: bill,
  version: 1n,
  networkIdentifier: NetworkIdentifier.LOCAL,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, proofFactory);
const unlockBillHash = await client.sendTransaction(unlockBillTransactionOrder);
const unlockBillProof = await client.waitTransactionProof(unlockBillHash, UnlockBill);
console.log(
  `Unlocking bill response - ${TransactionStatus[unlockBillProof.transactionRecord.serverMetadata.successIndicator]}`,
);
