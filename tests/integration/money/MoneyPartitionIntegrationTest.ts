import { AddFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/AddFeeCreditTransactionRecordWithProof.js';
import { IUnitId } from '../../../src/IUnitId.js';
import { Bill } from '../../../src/money/Bill.js';
import { LockBillTransactionRecordWithProof } from '../../../src/money/transactions/LockBillTransactionRecordWithProof.js';
import { SplitBillTransactionRecordWithProof } from '../../../src/money/transactions/SplitBillTransactionRecordWithProof.js';
import { SwapBillsWithDustCollectorTransactionRecordWithProof } from '../../../src/money/transactions/SwapBillsWithDustCollectorTransactionRecordWithProof.js';
import { TransferBillToDustCollectorTransactionRecordWithProof } from '../../../src/money/transactions/TransferBillToDustCollectorTransactionRecordWithProof.js';
import { TransferBillTransactionRecordWithProof } from '../../../src/money/transactions/TransferBillTransactionRecordWithProof.js';
import { UnlockBillTransactionRecordWithProof } from '../../../src/money/transactions/UnlockBillTransactionRecordWithProof.js';
import { UnsignedLockBillTransactionOrder } from '../../../src/money/transactions/UnsignedLockBillTransactionOrder.js';
import { UnsignedSplitBillTransactionOrder } from '../../../src/money/transactions/UnsignedSplitBillTransactionOrder.js';
import { UnsignedSwapBillsWithDustCollectorTransactionOrder } from '../../../src/money/transactions/UnsignedSwapBillsWithDustCollectorTransactionOrder.js';
import { UnsignedTransferBillToDustCollectorTransactionOrder } from '../../../src/money/transactions/UnsignedTransferBillToDustCollectorTransactionOrder.js';
import { UnsignedTransferBillTransactionOrder } from '../../../src/money/transactions/UnsignedTransferBillTransactionOrder.js';
import { UnsignedUnlockBillTransactionOrder } from '../../../src/money/transactions/UnsignedUnlockBillTransactionOrder.js';
import { PartitionIdentifier } from '../../../src/PartitionIdentifier.js';
import { DefaultSigningService } from '../../../src/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '../../../src/StateApiClientFactory.js';
import { PayToPublicKeyHashPredicate } from '../../../src/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { PayToPublicKeyHashProofFactory } from '../../../src/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../../src/transaction/record/TransactionStatus.js';
import { UnitId } from '../../../src/UnitId.js';
import { Base16Converter } from '../../../src/util/Base16Converter.js';
import config from '../config/config.js';
import { addFeeCredit, createTransactionData } from '../utils/TestUtils.js';

describe('Money Client Integration Tests', () => {
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const proofFactory = new PayToPublicKeyHashProofFactory(signingService);

  const moneyClient = createMoneyClient({
    transport: http(config.moneyPartitionUrl),
  });

  let feeCreditRecordId: IUnitId; // can no longer be static as hash contains timeout

  it('Get round number, get block and get trust base', async () => {
    const round = await moneyClient.getRoundNumber();
    expect(round).not.toBeNull();
    const block = await moneyClient.getBlock(round);
    expect(block).not.toBeNull();
    const rootTrustBase = await moneyClient.getTrustBase(round);
    expect(rootTrustBase).not.toBeNull();
    expect(rootTrustBase.epoch).toEqual(1n); // TODO after backend changes, this should be equal to round number, currently hardcoded to 1
    expect(rootTrustBase.rootNodes.size).toEqual(3); // TODO could possibly be a different number, depending on backend
    expect(rootTrustBase.signatures.size).toEqual(3); // TODO could possibly be a different number, depending on backend
  });

  it('Get units by owner ID and get unit', async () => {
    const moneyUnitIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).bills;
    expect(moneyUnitIds.length).toBeGreaterThan(0);
    const moneyUnit = await moneyClient.getUnit(moneyUnitIds[0], true, Bill);
    expect(moneyUnit!.unitId).not.toBeNull();
  });

  it('Add fee credit', async () => {
    const addFeeCreditHash = await addFeeCredit(
      moneyClient,
      moneyClient,
      PartitionIdentifier.MONEY,
      signingService.publicKey,
      proofFactory,
    );

    const addFeeCreditProof = await moneyClient.waitTransactionProof(
      addFeeCreditHash,
      AddFeeCreditTransactionRecordWithProof,
    );
    expect(addFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Adding fee credit successful');
    feeCreditRecordId = addFeeCreditProof.transactionRecord.transactionOrder.payload.unitId;
  }, 20000);

  it('Lock and unlock bill', async () => {
    const billUnitIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).bills;
    expect(billUnitIds.length).toBeGreaterThan(0);

    const round = await moneyClient.getRoundNumber();
    const bill = (await moneyClient.getUnit(billUnitIds[0], false, Bill))!;
    expect(bill).not.toBeNull();

    console.log('Locking bill...');
    const lockBillTransactionOrder = UnsignedLockBillTransactionOrder.create({
      status: 5n,
      bill: bill,
      ...createTransactionData(round, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);

    const lockBillHash = await moneyClient.sendTransaction(lockBillTransactionOrder);
    const lockBillProof = await moneyClient.waitTransactionProof(lockBillHash, LockBillTransactionRecordWithProof);
    expect(lockBillProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Locking bill successful');

    console.log('Unlocking bill...');
    const lockedBill = (await moneyClient.getUnit(bill.unitId, false, Bill))!;
    expect(lockedBill).not.toBeNull();
    expect(lockedBill.counter).not.toEqual(bill.counter);
    const unlockBillTransactionOrder = UnsignedUnlockBillTransactionOrder.create({
      bill: lockedBill,
      ...createTransactionData(round, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);
    const unlockBillHash = await moneyClient.sendTransaction(unlockBillTransactionOrder);
    const unlockBillProof = await moneyClient.waitTransactionProof(
      unlockBillHash,
      UnlockBillTransactionRecordWithProof,
    );
    expect(unlockBillProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Unlocking bill successful');
  }, 20000);

  it('Split and transfer bill', async () => {
    const round = await moneyClient.getRoundNumber();
    let billUnitIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).bills;
    expect(billUnitIds.length).toBeGreaterThan(0);
    const billUnitId = billUnitIds[0];
    let bill = await moneyClient.getUnit(billUnitId, false, Bill);
    expect(bill).not.toBeNull();

    console.log('Splitting bill...');
    const splitBillTransactionOrder = UnsignedSplitBillTransactionOrder.create({
      splits: [
        {
          value: 10n,
          ownerPredicate: PayToPublicKeyHashPredicate.create(signingService.publicKey),
        },
      ],
      bill: bill!,
      ...createTransactionData(round, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);
    const splitBillHash = await moneyClient.sendTransaction(splitBillTransactionOrder);
    const splitBillProof = await moneyClient.waitTransactionProof(splitBillHash, SplitBillTransactionRecordWithProof);
    expect(splitBillProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Splitting bill successful');

    bill = await moneyClient.getUnit(billUnitId, false, Bill);
    expect(bill!.value).toBeGreaterThan(0);

    billUnitIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).bills;
    const targetBillUnitId = billUnitIds
      .filter((id: IUnitId) => {
        return !UnitId.equals(id, bill!.unitId);
      })
      .at(0) as IUnitId;
    const targetBill = await moneyClient.getUnit(targetBillUnitId, false, Bill);

    console.log('Transferring bill...');
    const transferBillTransactionOrder = UnsignedTransferBillTransactionOrder.create({
      ownerPredicate: PayToPublicKeyHashPredicate.create(signingService.publicKey),
      bill: targetBill!,
      ...createTransactionData(round, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);
    const transferBillHash = await moneyClient.sendTransaction(transferBillTransactionOrder);
    const transferBillProof = await moneyClient.waitTransactionProof(
      transferBillHash,
      TransferBillTransactionRecordWithProof,
    );
    expect(transferBillProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Transferring bill successful');
  }, 20000);

  it('Transfer and swap bill with dust collector', async () => {
    const round = await moneyClient.getRoundNumber();
    const billUnitIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).bills;
    expect(billUnitIds.length).toBeGreaterThan(0);
    const bill = await moneyClient.getUnit(billUnitIds[0], false, Bill);
    expect(bill).not.toBeNull();

    const targetBill = await moneyClient.getUnit(billUnitIds[1], false, Bill);
    expect(targetBill).not.toBeNull();

    console.log('Transferring bill to dust collector...');
    const transferBillToDcTransactionOrder = UnsignedTransferBillToDustCollectorTransactionOrder.create({
      bill: bill!,
      targetBill: targetBill!,
      ...createTransactionData(round, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);
    const transferBillToDcHash = await moneyClient.sendTransaction(transferBillToDcTransactionOrder);
    const transferBillToDcProof = await moneyClient.waitTransactionProof(
      transferBillToDcHash,
      TransferBillToDustCollectorTransactionRecordWithProof,
    );
    expect(transferBillToDcProof.transactionRecord.serverMetadata.successIndicator).toEqual(
      TransactionStatus.Successful,
    );
    console.log('Transferring bill to dust collector successful');

    console.log('Swapping bill with dust collector...');
    const swapBillWithDcTransactionOrder = UnsignedSwapBillsWithDustCollectorTransactionOrder.create({
      bill: targetBill!,
      proofs: [transferBillToDcProof],
      ...createTransactionData(round, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);
    const swapBillsWithDcHash = await moneyClient.sendTransaction(swapBillWithDcTransactionOrder);
    const swapBillsWithDcProof = await moneyClient.waitTransactionProof(
      swapBillsWithDcHash,
      SwapBillsWithDustCollectorTransactionRecordWithProof,
    );
    expect(swapBillsWithDcProof.transactionRecord.serverMetadata.successIndicator).toEqual(
      TransactionStatus.Successful,
    );
    console.log('Swapping bill successful');
  }, 20000);
});
