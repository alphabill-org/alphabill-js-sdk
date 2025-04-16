import assert from 'node:assert';
import { AddFeeCredit } from '../../../src/fees/transactions/AddFeeCredit.js';
import { TransferFeeCredit } from '../../../src/fees/transactions/TransferFeeCredit.js';
import { IUnitId } from '../../../src/IUnitId.js';
import { MoneyPartitionJsonRpcClient } from '../../../src/json-rpc/MoneyPartitionJsonRpcClient.js';
import { TokenPartitionJsonRpcClient } from '../../../src/json-rpc/TokenPartitionJsonRpcClient.js';
import { Bill } from '../../../src/money/Bill.js';
import { ClientMetadata } from '../../../src/transaction/ClientMetadata.js';
import { ITransactionData } from '../../../src/transaction/ITransactionData.js';
import { AlwaysTruePredicate } from '../../../src/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../../src/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { IProofFactory } from '../../../src/transaction/proofs/IProofFactory.js';
import { TransactionStatus } from '../../../src/transaction/record/TransactionStatus.js';

export function createTransactionData(
  round: bigint,
  networkIdentifier: number,
  partitionIdentifier: number,
  feeCreditRecordId?: IUnitId,
): ITransactionData {
  return {
    version: 1n,
    networkIdentifier: networkIdentifier,
    partitionIdentifier: partitionIdentifier,
    stateLock: null,
    metadata: createMetadata(round, feeCreditRecordId),
    stateUnlock: new AlwaysTruePredicate(),
  };
}

export function createMetadata(round: bigint, feeCreditRecordId?: IUnitId): ClientMetadata {
  return new ClientMetadata(round + 100n, 10n, feeCreditRecordId ?? null, new Uint8Array());
}

export async function addFeeCredit(
  moneyClient: MoneyPartitionJsonRpcClient,
  clientToAddFeesTo: MoneyPartitionJsonRpcClient | TokenPartitionJsonRpcClient,
  targetPartitionIdentifier: number,
  networkIdentifier: number,
  partitionIdentifier: number,
  publicKey: Uint8Array,
  proofFactory: IProofFactory,
): Promise<Uint8Array> {
  const ownerPredicate = PayToPublicKeyHashPredicate.create(publicKey);
  const unitIds = (await moneyClient.getUnitsByOwnerId(publicKey)).bills;
  expect(unitIds.length).toBeGreaterThan(0);

  // TODO: Find bill which has the money instead of first
  const bill = await moneyClient.getUnit(unitIds[0], false, Bill);
  assert(bill, 'No bill found.');

  const amountToFeeCredit = 100n;
  expect(bill.value).toBeGreaterThan(amountToFeeCredit);

  const round = (await clientToAddFeesTo.getRoundInfo()).roundNumber;

  console.log('Transferring to fee credit...');
  const transferFeeCreditTransactionOrder = await TransferFeeCredit.create({
    amount: amountToFeeCredit,
    targetPartitionIdentifier: targetPartitionIdentifier,
    latestAdditionTime: round + 100n,
    feeCreditRecord: {
      ownerPredicate: ownerPredicate,
    },
    bill,
    ...createTransactionData(round, networkIdentifier, partitionIdentifier),
  }).sign(proofFactory);

  const transferFeeCreditHash = await moneyClient.sendTransaction(transferFeeCreditTransactionOrder);

  const transferFeeCreditProof = await moneyClient.waitTransactionProof(transferFeeCreditHash, TransferFeeCredit);
  expect(transferFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(
    TransactionStatus.Successful,
  );
  console.log('Transfer to fee credit successful');
  const feeCreditRecordId = transferFeeCreditTransactionOrder.payload.attributes.targetUnitId;

  console.log('Adding fee credit');
  const addFeeCreditTransactionOrder = await AddFeeCredit.create({
    targetPartitionIdentifier: targetPartitionIdentifier,
    ownerPredicate: ownerPredicate,
    proof: transferFeeCreditProof,
    feeCreditRecord: { unitId: feeCreditRecordId },
    ...createTransactionData(round, networkIdentifier, partitionIdentifier),
  }).sign(proofFactory);

  console.log('Adding fee credit probably successful');
  return await clientToAddFeesTo.sendTransaction(addFeeCreditTransactionOrder);
}
