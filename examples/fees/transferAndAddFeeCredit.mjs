import { AddFeeCredit } from '../../lib/fees/transactions/AddFeeCredit.js';
import { TransferFeeCredit } from '../../lib/fees/transactions/TransferFeeCredit.js';
import { Bill } from '../../lib/money/Bill.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createMoneyClient, createTokenClient, http } from '../../lib/StateApiClientFactory.js';
import { ClientMetadata } from '../../lib/transaction/ClientMetadata.js';
import { AlwaysTruePredicate } from '../../lib/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { PayToPublicKeyHashProofFactory } from '../../lib/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../lib/transaction/record/TransactionStatus.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
import config from '../config.js';

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const proofFactory = new PayToPublicKeyHashProofFactory(signingService);

const moneyClient = createMoneyClient({
  transport: http(config.moneyPartitionUrl),
});

const tokenClient = createTokenClient({
  transport: http(config.tokenPartitionUrl),
});

const billIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).bills;
if (billIds.length === 0) {
  throw new Error('No bills available');
}

const partitions = [
  {
    client: moneyClient,
    partitionIdentifier: config.moneyPartitionIdentifier,
  },
  {
    client: tokenClient,
    partitionIdentifier: config.tokenPartitionIdentifier,
  },
];

for (const { client, partitionIdentifier } of partitions) {
  const bill = await moneyClient.getUnit(billIds[0], false, Bill);
  const round = (await moneyClient.getRoundInfo()).roundNumber;
  const ownerPredicate = await PayToPublicKeyHashPredicate.create(signingService.publicKey);

  const feeAmount = 100n;

  // if following variables are null, a new fee credit record is created.
  // in order to use existing fee credit record, use these variables.
  const fcrId = null;
  const fcrCounter = null;

  if (fcrId == null && fcrCounter == null) {
    console.log('Creating new fee credit record');
  } else {
    console.log(`Using fee credit record with ID ${fcrId}`);
  }

  console.log(`Transferring ${feeAmount} fee credit to partition ID ${partitionIdentifier}`);
  const transferFeeCreditTransactionOrder = await TransferFeeCredit.create({
    amount: feeAmount,
    targetPartitionIdentifier: partitionIdentifier,
    latestAdditionTime: round + 60n,
    feeCreditRecord: { ownerPredicate: ownerPredicate, unitId: fcrId, counter: fcrCounter },
    bill,
    version: 1n,
    networkIdentifier: config.networkIdentifier,
    partitionIdentifier: config.moneyPartitionIdentifier,
    stateLock: null,
    metadata: new ClientMetadata(round + 60n, 5n, null, new Uint8Array()),
    stateUnlock: new AlwaysTruePredicate(),
  }).sign(proofFactory);
  const transferFeeCreditHash = await moneyClient.sendTransaction(transferFeeCreditTransactionOrder);
  const transferFeeCreditProof = await moneyClient.waitTransactionProof(transferFeeCreditHash, TransferFeeCredit);
  console.log(
    `Transfer fee credit response - ${TransactionStatus[transferFeeCreditProof.transactionRecord.serverMetadata.successIndicator]}`,
  );
  const feeCreditRecordId = transferFeeCreditTransactionOrder.payload.attributes.targetUnitId;

  console.log('----------------------------------------------------------------------------------------');

  console.log(`Adding fee credit to partition ID ${partitionIdentifier}`);
  const addFeeCreditTransactionOrder = await AddFeeCredit.create({
    targetPartitionIdentifier: partitionIdentifier,
    ownerPredicate: ownerPredicate,
    proof: transferFeeCreditProof,
    feeCreditRecord: { unitId: feeCreditRecordId },
    version: 1n,
    networkIdentifier: config.networkIdentifier,
    partitionIdentifier: config.moneyPartitionIdentifier,
    stateLock: null,
    metadata: new ClientMetadata(round + 60n, 5n, null, new Uint8Array()),
    stateUnlock: new AlwaysTruePredicate(),
  }).sign(proofFactory);
  const addFeeCreditHash = await client.sendTransaction(addFeeCreditTransactionOrder);
  const addFeeCreditProof = await client.waitTransactionProof(addFeeCreditHash, AddFeeCredit);
  console.log(
    `Add fee credit response - ${TransactionStatus[addFeeCreditProof.transactionRecord.serverMetadata.successIndicator]}`,
  );

  console.log('----------------------------------------------------------------------------------------');
}
