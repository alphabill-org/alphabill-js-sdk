import assert from 'node:assert';
import { ICborCodec } from '../../../src/codec/cbor/ICborCodec.js';
import { TransferFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/TransferFeeCreditTransactionRecordWithProof.js';
import { UnsignedAddFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedAddFeeCreditTransactionOrder.js';
import { UnsignedTransferFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedTransferFeeCreditTransactionOrder.js';
import { IUnitId } from '../../../src/IUnitId.js';
import { MoneyPartitionJsonRpcClient } from '../../../src/json-rpc/MoneyPartitionJsonRpcClient.js';
import { TokenPartitionJsonRpcClient } from '../../../src/json-rpc/TokenPartitionJsonRpcClient.js';
import { Bill } from '../../../src/money/Bill.js';
import { MoneyPartitionUnitType } from '../../../src/money/MoneyPartitionUnitType.js';
import { NetworkIdentifier } from '../../../src/NetworkIdentifier.js';
import { SystemIdentifier } from '../../../src/SystemIdentifier.js';
import { TokenPartitionUnitType } from '../../../src/tokens/TokenPartitionUnitType.js';
import { ITransactionClientMetadata } from '../../../src/transaction/ITransactionClientMetadata.js';
import { ITransactionData } from '../../../src/transaction/order/ITransactionData.js';
import { AlwaysTruePredicate } from '../../../src/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../../src/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { IProofFactory } from '../../../src/transaction/proofs/IProofFactory.js';
import { TransactionStatus } from '../../../src/transaction/record/TransactionStatus.js';
import { UnitIdWithType } from '../../../src/transaction/UnitIdWithType.js';
import { Base16Converter } from '../../../src/util/Base16Converter.js';

export function createTransactionData(round: bigint, feeCreditRecordId?: IUnitId): ITransactionData {
  return {
    networkIdentifier: NetworkIdentifier.LOCAL,
    stateLock: null,
    metadata: createMetadata(round, feeCreditRecordId),
    stateUnlock: new AlwaysTruePredicate(),
  };
}

export function createMetadata(round: bigint, feeCreditRecordId?: IUnitId): ITransactionClientMetadata {
  return {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId: feeCreditRecordId ?? null,
    referenceNumber: new Uint8Array(),
  };
}

export async function addFeeCredit(
  moneyClient: MoneyPartitionJsonRpcClient,
  clientToAddFeesTo: MoneyPartitionJsonRpcClient | TokenPartitionJsonRpcClient,
  targetSystemIdentifier: SystemIdentifier,
  publicKey: Uint8Array,
  cborCodec: ICborCodec,
  proofFactory: IProofFactory,
  tokenType: TokenPartitionUnitType.FEE_CREDIT_RECORD | MoneyPartitionUnitType.FEE_CREDIT_RECORD,
): Promise<Uint8Array> {
  const ownerPredicate = await PayToPublicKeyHashPredicate.create(cborCodec, publicKey);
  const unitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(publicKey)).filter(
    (id) => id.type.toBase16() === Base16Converter.encode(new Uint8Array([MoneyPartitionUnitType.BILL])),
  );
  expect(unitIds.length).toBeGreaterThan(0);

  // TODO: Find bill which has the money instead of first
  const bill = await moneyClient.getUnit(unitIds[0], false, Bill);
  assert(bill, 'No bill found.');

  const amountToFeeCredit = 100n;
  expect(bill.value).toBeGreaterThan(amountToFeeCredit);

  const round = await clientToAddFeesTo.getRoundNumber();

  console.log('Transferring to fee credit...');
  const transferFeeCreditTransactionOrder = await UnsignedTransferFeeCreditTransactionOrder.create(
    {
      amount: amountToFeeCredit,
      targetSystemIdentifier: targetSystemIdentifier,
      latestAdditionTime: round + 60n,
      feeCreditRecord: {
        ownerPredicate: ownerPredicate,
        unitType: tokenType,
      },
      bill,
      ...createTransactionData(round),
    },
    cborCodec,
  ).then((transactionOrder) => transactionOrder.sign(proofFactory));

  const transferFeeCreditHash = await moneyClient.sendTransaction(transferFeeCreditTransactionOrder);

  const transferFeeCreditProof = await moneyClient.waitTransactionProof(
    transferFeeCreditHash,
    TransferFeeCreditTransactionRecordWithProof,
  );
  expect(transferFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(
    TransactionStatus.Successful,
  );
  console.log('Transfer to fee credit successful');
  const feeCreditRecordId = new UnitIdWithType(
    transferFeeCreditTransactionOrder.payload.attributes.targetUnitId.bytes,
    tokenType,
  );

  console.log('Adding fee credit');
  const addFeeCreditTransactionOrder = await UnsignedAddFeeCreditTransactionOrder.create(
    {
      targetSystemIdentifier: targetSystemIdentifier,
      ownerPredicate: ownerPredicate,
      proof: transferFeeCreditProof,
      feeCreditRecord: { unitId: feeCreditRecordId },
      ...createTransactionData(round),
    },
    cborCodec,
  ).then((transactionOrder) => transactionOrder.sign(proofFactory));

  console.log('Adding fee credit probably successful');
  return await clientToAddFeesTo.sendTransaction(addFeeCreditTransactionOrder);
}
