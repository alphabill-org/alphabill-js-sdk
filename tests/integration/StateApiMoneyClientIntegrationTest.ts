import { Bill } from '../../src/Bill.js';
import { CborCodecNode } from '../../src/codec/cbor/CborCodecNode.js';
import { FeeCreditRecord } from '../../src/FeeCreditRecord.js';
import { IUnit } from '../../src/IUnit.js';
import { IUnitId } from '../../src/IUnitId.js';
import { DefaultSigningService } from '../../src/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '../../src/StateApiClientFactory.js';
import { SystemIdentifier } from '../../src/SystemIdentifier.js';
import { CloseFeeCreditAttributes } from '../../src/transaction/CloseFeeCreditAttributes.js';
import { FeeCreditRecordUnitIdFactory } from '../../src/transaction/FeeCreditRecordUnitIdFactory.js';
import { PayToPublicKeyHashPredicate } from '../../src/transaction/PayToPublicKeyHashPredicate.js';
import { TransactionOrderFactory } from '../../src/transaction/TransactionOrderFactory.js';
import { TransactionPayload } from '../../src/transaction/TransactionPayload.js';
import { TransferBillToDustCollectorAttributes } from '../../src/transaction/TransferBillToDustCollectorAttributes.js';
import { TransferFeeCreditAttributes } from '../../src/transaction/TransferFeeCreditAttributes.js';
import { UnitIdWithType } from '../../src/transaction/UnitIdWithType.js';
import { UnitType } from '../../src/transaction/UnitType.js';
import { TransactionRecordWithProof } from '../../src/TransactionRecordWithProof.js';
import { Base16Converter } from '../../src/util/Base16Converter.js';
import config from './config/config.js';
import { createMetadata, waitTransactionProof } from './utils/TestUtils.js';

describe('Money Client Integration Tests', () => {
  const cborCodec = new CborCodecNode();
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);
  const feeCreditRecordUnitIdFactory = new FeeCreditRecordUnitIdFactory();

  const moneyClient = createMoneyClient({
    transport: http(config.moneyPartitionUrl, new CborCodecNode()),
    transactionOrderFactory,
    feeCreditRecordUnitIdFactory,
  });

  let feeCreditRecordId: UnitIdWithType; // can no longer be static as hash contains timeout

  it('Get round number and get block', async () => {
    const round = await moneyClient.getRoundNumber();
    expect(round).not.toBeNull();
    const block = await moneyClient.getBlock(round);
    expect(block).not.toBeNull();
    expect(block.length).not.toBe(0);
  });

  it('Get units by owner ID and get unit', async () => {
    const moneyUnitIds: IUnitId[] = await moneyClient.getUnitsByOwnerId(signingService.publicKey);
    expect(moneyUnitIds.length).toBeGreaterThan(0);
    const moneyUnit = (await moneyClient.getUnit(moneyUnitIds[0], true)) as IUnit;
    expect(moneyUnit.unitId).not.toBeNull();
  });

  it('Add fee credit', async () => {
    const unitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
    );
    expect(unitIds.length).toBeGreaterThan(0);

    const bill = (await moneyClient.getUnit(unitIds[0], false)) as Bill;
    expect(bill).not.toBeNull();
    const round = await moneyClient.getRoundNumber();
    const ownerPredicate = await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey);

    const amountToFeeCredit = 100n;
    expect(bill.value).toBeGreaterThan(amountToFeeCredit);

    console.log('Transferring to fee credit...');
    const transferToFeeCreditHash = await moneyClient.transferToFeeCredit(
      {
        bill: bill,
        amount: amountToFeeCredit,
        systemIdentifier: SystemIdentifier.MONEY_PARTITION,
        feeCreditRecordParams: {
          ownerPredicate: ownerPredicate,
          unitType: UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD,
        },
        latestAdditionTime: round + 60n,
      },
      createMetadata(round),
    );

    const proof: TransactionRecordWithProof<TransactionPayload<TransferFeeCreditAttributes>> =
      await waitTransactionProof(moneyClient, transferToFeeCreditHash);
    console.log('Transfer to fee credit successful');
    const attr = proof.transactionRecord.transactionOrder.payload as TransactionPayload<TransferFeeCreditAttributes>;
    feeCreditRecordId = new UnitIdWithType(
      attr.attributes.targetUnitId.bytes,
      UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD,
    );

    console.log('Adding fee credit');
    const addFeeCreditHash = await moneyClient.addFeeCredit(
      {
        ownerPredicate: ownerPredicate,
        proof,
        feeCreditRecord: { unitId: feeCreditRecordId },
      },
      createMetadata(round),
    );

    await waitTransactionProof(moneyClient, addFeeCreditHash);
    console.log('Adding fee credit successful');
  }, 20000);

  it('Lock and unlock fee credit', async () => {
    const feeCreditRecord = (await moneyClient.getUnit(feeCreditRecordId, false)) as FeeCreditRecord;
    expect(feeCreditRecord.locked).toBe(false);
    const round = await moneyClient.getRoundNumber();

    console.log('Locking fee credit...');
    const lockHash = await moneyClient.lockFeeCredit(
      {
        status: 5n,
        unit: feeCreditRecord,
      },
      createMetadata(round),
    );

    await waitTransactionProof(moneyClient, lockHash);
    console.log('Locking fee credit successful');
    const feeCreditAfterLock = (await moneyClient.getUnit(feeCreditRecordId, false)) as FeeCreditRecord;
    expect(feeCreditAfterLock.locked).toBe(true);

    console.log('Unlocking fee credit...');
    const unlockHash = await moneyClient.unlockFeeCredit(
      {
        unit: feeCreditAfterLock,
      },
      createMetadata(round),
    );

    await waitTransactionProof(moneyClient, unlockHash);
    console.log('Unlocking fee credit successful');
    const feeCreditAfterUnlock = (await moneyClient.getUnit(feeCreditRecordId, false)) as FeeCreditRecord;
    expect(feeCreditAfterUnlock.locked).toBe(false);
  }, 20000);

  it('Lock and unlock bill', async () => {
    const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
    );
    expect(billUnitIds.length).toBeGreaterThan(0);

    const round = await moneyClient.getRoundNumber();
    const bill = (await moneyClient.getUnit(billUnitIds[0], false)) as Bill;
    expect(bill).not.toBeNull();

    console.log('Locking bill...');
    const lockHash = await moneyClient.lockBill(
      {
        status: 5n,
        unit: bill,
      },
      createMetadata(round, feeCreditRecordId),
    );
    await waitTransactionProof(moneyClient, lockHash);
    console.log('Locking bill successful');

    console.log('Unlocking bill...');
    const lockedBill = (await moneyClient.getUnit(bill.unitId, false)) as Bill;
    expect(lockedBill).not.toBeNull();
    expect(lockedBill.counter).not.toEqual(bill.counter);
    const unlockHash = await moneyClient.unlockBill(
      {
        unit: lockedBill,
      },
      createMetadata(round, feeCreditRecordId),
    );
    await waitTransactionProof(moneyClient, unlockHash);
    console.log('Unlocking bill successful');
  }, 20000);

  it('Split and transfer bill', async () => {
    const round = await moneyClient.getRoundNumber();
    const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
    );
    expect(billUnitIds.length).toBeGreaterThan(0);
    const billUnitId = billUnitIds[0];
    let bill = (await moneyClient.getUnit(billUnitId, false)) as Bill;
    expect(bill).not.toBeNull();

    console.log('Splitting bill...');
    const splitBillHash = await moneyClient.splitBill(
      {
        splits: [
          {
            value: 10n,
            ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          },
        ],
        bill: bill,
      },
      createMetadata(round, feeCreditRecordId),
    );
    await waitTransactionProof(moneyClient, splitBillHash);
    console.log('Splitting bill successful');

    bill = (await moneyClient.getUnit(billUnitId, false)) as Bill;
    expect(bill.value).toBeGreaterThan(0);

    const targetBillUnitId = billUnitIds
      .filter((id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA && id.bytes !== bill.unitId.bytes)
      .at(0) as IUnitId;
    const targetBill = (await moneyClient.getUnit(targetBillUnitId, false)) as Bill;

    console.log('Transferring bill...');
    const transferBillHash = await moneyClient.transferBill(
      {
        ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
        bill: targetBill,
      },
      createMetadata(round, feeCreditRecordId),
    );
    await waitTransactionProof(moneyClient, transferBillHash);
    console.log('Transferring bill successful');
  }, 20000);

  it('Transfer and swap bill with dust collector', async () => {
    const round = await moneyClient.getRoundNumber();
    const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
    );
    expect(billUnitIds.length).toBeGreaterThan(0);
    const bill = (await moneyClient.getUnit(billUnitIds[0], false)) as Bill;
    expect(bill).not.toBeNull();

    const targetBillUnitId = billUnitIds
      .filter((id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA && id.bytes !== bill.unitId.bytes)
      .at(0) as IUnitId;
    const targetBill = (await moneyClient.getUnit(targetBillUnitId, false)) as Bill;
    expect(targetBill).not.toBeNull();

    console.log('Transferring bill to dust collector...');
    const swapBillHash = await moneyClient.transferBillToDustCollector(
      {
        bill: bill,
        targetBill: targetBill,
      },
      createMetadata(round, feeCreditRecordId),
    );
    const transactionProof: TransactionRecordWithProof<TransactionPayload<TransferBillToDustCollectorAttributes>> =
      await waitTransactionProof(moneyClient, swapBillHash);
    console.log('Transferring bill to dust collector successful');

    console.log('Swapping bill with dust collector...');
    await moneyClient.swapBillsWithDustCollector(
      {
        bill: targetBill,
        ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
        proofs: [transactionProof],
      },
      createMetadata(round, feeCreditRecordId),
    );

    await waitTransactionProof(moneyClient, swapBillHash);
    console.log('Swapping bill successful');
  }, 20000);

  it('Close and reclaim fee credit', async () => {
    const round = await moneyClient.getRoundNumber();
    const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
    );
    expect(billUnitIds.length).toBeGreaterThan(0);
    const billUnitId = billUnitIds[0];
    let bill = (await moneyClient.getUnit(billUnitId, false)) as Bill;
    expect(bill).not.toBeNull();

    const feeCreditRecord = (await moneyClient.getUnit(feeCreditRecordId, false)) as FeeCreditRecord;
    console.log('Closing fee credit...');
    const closeFeeCreditHash = await moneyClient.closeFeeCredit(
      {
        amount: bill.value,
        bill: bill,
        feeCreditRecord: feeCreditRecord,
      },
      createMetadata(round),
    );
    const proof: TransactionRecordWithProof<TransactionPayload<CloseFeeCreditAttributes>> = await waitTransactionProof(
      moneyClient,
      closeFeeCreditHash,
    );
    console.log('Closing fee credit successful');

    bill = (await moneyClient.getUnit(billUnitId, false)) as Bill;
    console.log('Reclaiming fee credit...');
    const reclaimFeeCreditHash = await moneyClient.reclaimFeeCredit(
      {
        proof: proof,
        bill: bill,
      },
      createMetadata(round),
    );
    await waitTransactionProof(moneyClient, reclaimFeeCreditHash);
    console.log('Reclaiming fee credit successful');
  }, 20000);
});
