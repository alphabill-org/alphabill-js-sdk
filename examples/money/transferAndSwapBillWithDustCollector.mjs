import { Bill } from '../../src/money/Bill.js';
import { SwapBillsWithDustCollector } from '../../src/money/transactions/SwapBillsWithDustCollector.js';
import { TransferBillToDustCollector } from '../../src/money/transactions/TransferBillToDustCollector.js';
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

const round = (await client.getRoundInfo()).roundNumber;
const units = await client.getUnitsByOwnerId(signingService.publicKey);
const feeCreditRecordId = units.feeCreditRecords.at(0);
const billUnitIds = units.bills;
if (billUnitIds.length < 2) {
  throw new Error('Two bills are needed for the transaction.');
}
const bill = await client.getUnit(billUnitIds.at(0), false, Bill);
const targetBill = await client.getUnit(billUnitIds.at(1), false, Bill);

console.log(
  `Transferring bill with ID ${bill.unitId} to dust collector with target bill's ID set to ${targetBill.unitId}`,
);

const transferBillToDustCollectorTransactionOrder = await TransferBillToDustCollector.create({
  bill: bill,
  targetBill: targetBill,
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.moneyPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, proofFactory);
const transferBillToDustCollectorHash = await client.sendTransaction(transferBillToDustCollectorTransactionOrder);
const transferBillToDustCollectorProof = await client.waitTransactionProof(
  transferBillToDustCollectorHash,
  TransferBillToDustCollector,
);
console.log(
  `Transfer bill to dust collector response - ${TransactionStatus[transferBillToDustCollectorProof.transactionRecord.serverMetadata.successIndicator]}`,
);

console.log('----------------------------------------------------------------------------------------');

console.log(`Swapping transferred bill with dust collector`);
const swapBillWithDustCollectorTransactionOrder = await SwapBillsWithDustCollector.create({
  bill: targetBill,
  proofs: [transferBillToDustCollectorProof],
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.moneyPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, feeCreditRecordId, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory, proofFactory);
const swapBillsWithDustCollectorHash = await client.sendTransaction(swapBillWithDustCollectorTransactionOrder);
const swapBillsWithDustCollectorProof = await client.waitTransactionProof(
  swapBillsWithDustCollectorHash,
  SwapBillsWithDustCollector,
);
console.log(
  `Swap bill with dust collector response - ${TransactionStatus[swapBillsWithDustCollectorProof.transactionRecord.serverMetadata.successIndicator]}`,
);
