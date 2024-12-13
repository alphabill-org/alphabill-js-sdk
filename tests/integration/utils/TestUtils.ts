import assert from 'node:assert';
import { TransferFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/TransferFeeCreditTransactionRecordWithProof.js';
import { UnsignedAddFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedAddFeeCreditTransactionOrder.js';
import { UnsignedTransferFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedTransferFeeCreditTransactionOrder.js';
import { IUnitId } from '../../../src/IUnitId.js';
import { MoneyPartitionJsonRpcClient } from '../../../src/json-rpc/MoneyPartitionJsonRpcClient.js';
import { TokenPartitionJsonRpcClient } from '../../../src/json-rpc/TokenPartitionJsonRpcClient.js';
import { Bill } from '../../../src/money/Bill.js';
import { NetworkIdentifier } from '../../../src/NetworkIdentifier.js';
import { ClientMetadata } from '../../../src/transaction/ClientMetadata.js';
import { ITransactionClientMetadata } from '../../../src/transaction/ITransactionClientMetadata.js';
import { ITransactionData } from '../../../src/transaction/order/ITransactionData.js';
import { AlwaysTruePredicate } from '../../../src/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../../src/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { IProofFactory } from '../../../src/transaction/proofs/IProofFactory.js';
import { TransactionStatus } from '../../../src/transaction/record/TransactionStatus.js';

export function createTransactionData(round: bigint, feeCreditRecordId?: IUnitId): ITransactionData {
  return {
    version: 1n,
    networkIdentifier: NetworkIdentifier.LOCAL,
    stateLock: null,
    metadata: createMetadata(round, feeCreditRecordId),
    stateUnlock: new AlwaysTruePredicate(),
  };
}

export function createMetadata(round: bigint, feeCreditRecordId?: IUnitId): ITransactionClientMetadata {
  return new ClientMetadata(round + 60n, 10n, feeCreditRecordId ?? null, new Uint8Array());
}

export async function addFeeCredit(
  moneyClient: MoneyPartitionJsonRpcClient,
  clientToAddFeesTo: MoneyPartitionJsonRpcClient | TokenPartitionJsonRpcClient,
  targetPartitionIdentifier: number,
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

  const round = await clientToAddFeesTo.getRoundNumber();

  console.log('Transferring to fee credit...');
  const transferFeeCreditTransactionOrder = UnsignedTransferFeeCreditTransactionOrder.create({
    amount: amountToFeeCredit,
    targetPartitionIdentifier: targetPartitionIdentifier,
    latestAdditionTime: round + 60n,
    feeCreditRecord: {
      ownerPredicate: ownerPredicate,
    },
    bill,
    ...createTransactionData(round),
  }).sign(proofFactory);

  const transferFeeCreditHash = await moneyClient.sendTransaction(transferFeeCreditTransactionOrder);

  const transferFeeCreditProof = await moneyClient.waitTransactionProof(
    transferFeeCreditHash,
    TransferFeeCreditTransactionRecordWithProof,
  );
  expect(transferFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(
    TransactionStatus.Successful,
  );
  console.log('Transfer to fee credit successful');
  const feeCreditRecordId = transferFeeCreditTransactionOrder.payload.attributes.targetUnitId;

  console.log('Adding fee credit');
  const addFeeCreditTransactionOrder = UnsignedAddFeeCreditTransactionOrder.create({
    targetPartitionIdentifier: targetPartitionIdentifier,
    ownerPredicate: ownerPredicate,
    proof: transferFeeCreditProof,
    feeCreditRecord: { unitId: feeCreditRecordId },
    ...createTransactionData(round),
  }).sign(proofFactory);

  console.log('Adding fee credit probably successful');
  return await clientToAddFeesTo.sendTransaction(addFeeCreditTransactionOrder);
}
