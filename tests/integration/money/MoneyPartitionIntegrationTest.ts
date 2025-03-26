import { AddFeeCredit } from '../../../src/fees/transactions/AddFeeCredit.js';
import { IUnitId } from '../../../src/IUnitId.js';
import { Bill } from '../../../src/money/Bill.js';
import { LockBill } from '../../../src/money/transactions/LockBill.js';
import { SplitBill } from '../../../src/money/transactions/SplitBill.js';
import { SwapBillsWithDustCollector } from '../../../src/money/transactions/SwapBillsWithDustCollector.js';
import { TransferBill } from '../../../src/money/transactions/TransferBill.js';
import { TransferBillToDustCollector } from '../../../src/money/transactions/TransferBillToDustCollector.js';
import { UnlockBill } from '../../../src/money/transactions/UnlockBill.js';
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
  const networkIdentifier = config.networkIdentifier;
  const partitionIdentifier = config.moneyPartitionIdentifier;

  const moneyClient = createMoneyClient({
    transport: http(config.moneyPartitionUrl),
  });

  let feeCreditRecordId: IUnitId; // can no longer be static as hash contains timeout

  it('Get round number, get block and get trust base', async () => {
    const round = (await moneyClient.getRoundInfo()).roundNumber;
    expect(round).not.toBeNull();
    const block = await moneyClient.getBlock(round);
    expect(block).not.toBeNull();
    const rootTrustBase = await moneyClient.getTrustBase(round);
    expect(rootTrustBase).not.toBeNull();
    expect(rootTrustBase.epoch).toEqual(1n); // TODO after backend changes, this should be equal to round number, currently hardcoded to 1
    expect(rootTrustBase.rootNodes.length).toEqual(3); // TODO could possibly be a different number, depending on backend
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
      partitionIdentifier,
      networkIdentifier,
      partitionIdentifier,
      signingService.publicKey,
      proofFactory,
    );

    const addFeeCreditProof = await moneyClient.waitTransactionProof(addFeeCreditHash, AddFeeCredit);
    expect(addFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Adding fee credit successful');
    feeCreditRecordId = addFeeCreditProof.transactionRecord.transactionOrder.payload.unitId;
  }, 20000);

  it('Lock and unlock bill', async () => {
    const billUnitIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).bills;
    expect(billUnitIds.length).toBeGreaterThan(0);

    const round = (await moneyClient.getRoundInfo()).roundNumber;
    const bill = (await moneyClient.getUnit(billUnitIds[0], false, Bill))!;
    expect(bill).not.toBeNull();

    console.log('Locking bill...');
    const lockBillTransactionOrder = await LockBill.create({
      status: 5n,
      bill: bill,
      ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);

    const lockBillHash = await moneyClient.sendTransaction(lockBillTransactionOrder);
    const lockBillProof = await moneyClient.waitTransactionProof(lockBillHash, LockBill);
    expect(lockBillProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Locking bill successful');

    console.log('Unlocking bill...');
    const lockedBill = (await moneyClient.getUnit(bill.unitId, false, Bill))!;
    expect(lockedBill).not.toBeNull();
    expect(lockedBill.counter).not.toEqual(bill.counter);
    const unlockBillTransactionOrder = await UnlockBill.create({
      bill: lockedBill,
      ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);
    const unlockBillHash = await moneyClient.sendTransaction(unlockBillTransactionOrder);
    const unlockBillProof = await moneyClient.waitTransactionProof(unlockBillHash, UnlockBill);
    expect(unlockBillProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Unlocking bill successful');
  }, 20000);

  it('Split and transfer bill', async () => {
    const round = (await moneyClient.getRoundInfo()).roundNumber;
    let billUnitIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).bills;
    expect(billUnitIds.length).toBeGreaterThan(0);
    const billUnitId = billUnitIds[0];
    let bill = await moneyClient.getUnit(billUnitId, false, Bill);
    expect(bill).not.toBeNull();

    console.log('Splitting bill...');
    const splitBillTransactionOrder = await SplitBill.create({
      splits: [
        {
          value: 10n,
          ownerPredicate: PayToPublicKeyHashPredicate.create(signingService.publicKey),
        },
      ],
      bill: bill!,
      ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);
    const splitBillHash = await moneyClient.sendTransaction(splitBillTransactionOrder);
    const splitBillProof = await moneyClient.waitTransactionProof(splitBillHash, SplitBill);
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
    const transferBillTransactionOrder = await TransferBill.create({
      ownerPredicate: PayToPublicKeyHashPredicate.create(signingService.publicKey),
      bill: targetBill!,
      ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);
    const transferBillHash = await moneyClient.sendTransaction(transferBillTransactionOrder);
    const transferBillProof = await moneyClient.waitTransactionProof(transferBillHash, TransferBill);
    expect(transferBillProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Transferring bill successful');
  }, 20000);

  it('Transfer and swap bill with dust collector', async () => {
    const round = (await moneyClient.getRoundInfo()).roundNumber;
    const billUnitIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).bills;
    expect(billUnitIds.length).toBeGreaterThan(0);
    const bill = await moneyClient.getUnit(billUnitIds[0], false, Bill);
    expect(bill).not.toBeNull();

    const targetBill = await moneyClient.getUnit(billUnitIds[1], false, Bill);
    expect(targetBill).not.toBeNull();

    console.log('Transferring bill to dust collector...');
    const transferBillToDcTransactionOrder = await TransferBillToDustCollector.create({
      bill: bill!,
      targetBill: targetBill!,
      ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);
    const transferBillToDcHash = await moneyClient.sendTransaction(transferBillToDcTransactionOrder);
    const transferBillToDcProof = await moneyClient.waitTransactionProof(
      transferBillToDcHash,
      TransferBillToDustCollector,
    );
    expect(transferBillToDcProof.transactionRecord.serverMetadata.successIndicator).toEqual(
      TransactionStatus.Successful,
    );
    console.log('Transferring bill to dust collector successful');

    console.log('Swapping bill with dust collector...');
    const swapBillWithDcTransactionOrder = await SwapBillsWithDustCollector.create({
      bill: targetBill!,
      proofs: [transferBillToDcProof],
      ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
    }).sign(proofFactory, proofFactory);
    const swapBillsWithDcHash = await moneyClient.sendTransaction(swapBillWithDcTransactionOrder);
    const swapBillsWithDcProof = await moneyClient.waitTransactionProof(
      swapBillsWithDcHash,
      SwapBillsWithDustCollector,
    );
    expect(swapBillsWithDcProof.transactionRecord.serverMetadata.successIndicator).toEqual(
      TransactionStatus.Successful,
    );
    console.log('Swapping bill successful');
  }, 20000);
});
