import { CborCodecNode } from '../../src/codec/cbor/CborCodecNode.js';
import { IUnitId } from '../../src/IUnitId.js';
import { NetworkIdentifier } from '../../src/NetworkIdentifier.js';
import { DefaultSigningService } from '../../src/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '../../src/StateApiClientFactory.js';
import { SystemIdentifier } from '../../src/SystemIdentifier.js';
import { MoneyPartitionUnitType } from '../../src/transaction/MoneyPartitionUnitType.js';
import { UnsignedAddFeeCreditTransactionOrder } from '../../src/transaction/order/UnsignedAddFeeCreditTransactionOrder.js';
import { UnsignedCloseFeeCreditTransactionOrder } from '../../src/transaction/order/UnsignedCloseFeeCreditTransactionOrder.js';
import { UnsignedLockBillTransactionOrder } from '../../src/transaction/order/UnsignedLockBillTransactionOrder.js';
import { UnsignedLockFeeCreditTransactionOrder } from '../../src/transaction/order/UnsignedLockFeeCreditTransactionOrder.js';
import { UnsignedReclaimFeeCreditTransactionOrder } from '../../src/transaction/order/UnsignedReclaimFeeCreditTransactionOrder.js';
import { UnsignedSplitBillTransactionOrder } from '../../src/transaction/order/UnsignedSplitBillTransactionOrder.js';
import { UnsignedSwapBillsWithDustCollectorTransactionOrder } from '../../src/transaction/order/UnsignedSwapBillsWithDustCollectorTransactionOrder.js';
import { UnsignedTransferBillToDustCollectorTransactionOrder } from '../../src/transaction/order/UnsignedTransferBillToDustCollectorTransactionOrder.js';
import { UnsignedTransferBillTransactionOrder } from '../../src/transaction/order/UnsignedTransferBillTransactionOrder.js';
import { UnsignedTransferFeeCreditTransactionOrder } from '../../src/transaction/order/UnsignedTransferFeeCreditTransactionOrder.js';
import { UnsignedUnlockBillTransactionOrder } from '../../src/transaction/order/UnsignedUnlockBillTransactionOrder.js';
import { UnsignedUnlockFeeCreditTransactionOrder } from '../../src/transaction/order/UnsignedUnlockFeeCreditTransactionOrder.js';
import { AlwaysTruePredicate } from '../../src/transaction/predicate/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../src/transaction/predicate/PayToPublicKeyHashPredicate.js';
import { AddFeeCreditTransactionRecordWithProof } from '../../src/transaction/record/AddFeeCreditTransactionRecordWithProof.js';
import { CloseFeeCreditTransactionRecordWithProof } from '../../src/transaction/record/CloseFeeCreditTransactionRecordWithProof.js';
import { LockBillTransactionRecordWithProof } from '../../src/transaction/record/LockBillTransactionRecordWithProof.js';
import { LockFeeCreditTransactionRecordWithProof } from '../../src/transaction/record/LockFeeCreditTransactionRecordWithProof.js';
import { ReclaimFeeCreditTransactionRecordWithProof } from '../../src/transaction/record/ReclaimFeeCreditTransactionRecordWithProof.js';
import { SplitBillTransactionRecordWithProof } from '../../src/transaction/record/SplitBillTransactionRecordWithProof.js';
import { SwapBillsWithDustCollectorTransactionRecordWithProof } from '../../src/transaction/record/SwapBillsWithDustCollectorTransactionRecordWithProof.js';
import { TransferBillToDustCollectorTransactionRecordWithProof } from '../../src/transaction/record/TransferBillToDustCollectorTransactionRecordWithProof.js';
import { TransferBillTransactionRecordWithProof } from '../../src/transaction/record/TransferBillTransactionRecordWithProof.js';
import { TransferFeeCreditTransactionRecordWithProof } from '../../src/transaction/record/TransferFeeCreditTransactionRecordWithProof.js';
import { UnlockBillTransactionRecordWithProof } from '../../src/transaction/record/UnlockBillTransactionRecordWithProof.js';
import { UnlockFeeCreditTransactionRecordWithProof } from '../../src/transaction/record/UnlockFeeCreditTransactionRecordWithProof.js';
import { UnitIdWithType } from '../../src/transaction/UnitIdWithType.js';
import { Bill } from '../../src/unit/Bill.js';
import { FeeCreditRecord } from '../../src/unit/FeeCreditRecord.js';
import { UnitId } from '../../src/UnitId.js';
import { Base16Converter } from '../../src/util/Base16Converter.js';
import config from './config/config.js';
import { createMetadata } from './utils/TestUtils.js';
import { AlwaysTrueProofSigningService } from '../../src/transaction/proof/AlwaysTrueProofSigningService';

describe('Money Client Integration Tests', () => {
  const cborCodec = new CborCodecNode();
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));

  const moneyClient = createMoneyClient({
    transport: http(config.moneyPartitionUrl, new CborCodecNode()),
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
    console.log(
      (
        await moneyClient.getUnit(
          UnitId.fromBytes(
            Base16Converter.decode('0x000000000000000000000000000000000000000000000000000000000000000001'),
          ),
          false,
          Bill,
        )
      )?.toString(),
    );
    console.log(
      await moneyClient.getUnitsByOwnerId(
        Base16Converter.decode('0x830041025820f52022bb450407d92f13bf1c53128a676bcf304818e9f41a5ef4ebeae9c0d6b0'),
      ),
    );
    const moneyUnitIds: IUnitId[] = await moneyClient.getUnitsByOwnerId(signingService.publicKey);
    expect(moneyUnitIds.length).toBeGreaterThan(0);
    const moneyUnit = await moneyClient.getUnit(moneyUnitIds[0], true, Bill);
    expect(moneyUnit!.unitId).not.toBeNull();
  });

  it('Add fee credit', async () => {
    const unitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === Base16Converter.encode(new Uint8Array([MoneyPartitionUnitType.BILL])),
    );
    expect(unitIds.length).toBeGreaterThan(0);

    const bill = await moneyClient.getUnit(unitIds[0], false, Bill);
    expect(bill).not.toBeNull();
    const round = await moneyClient.getRoundNumber();
    const ownerPredicate = await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey);

    const amountToFeeCredit = 100n;
    expect(bill!.value).toBeGreaterThan(amountToFeeCredit);

    console.log('Transferring to fee credit...');
    const transferFeeCreditTransactionOrder = await (
      await UnsignedTransferFeeCreditTransactionOrder.create(
        {
          amount: amountToFeeCredit,
          targetSystemIdentifier: SystemIdentifier.MONEY_PARTITION,
          latestAdditionTime: round + 60n,
          feeCreditRecord: {
            ownerPredicate: ownerPredicate,
            unitType: MoneyPartitionUnitType.FEE_CREDIT_RECORD,
          },
          bill: bill!,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);

    const transferToFeeCreditHash = await moneyClient.sendTransaction(transferFeeCreditTransactionOrder);

    const proof = await moneyClient.waitTransactionProof(
      transferToFeeCreditHash,
      TransferFeeCreditTransactionRecordWithProof,
    );
    console.log('Transfer to fee credit successful');
    feeCreditRecordId = new UnitIdWithType(
      proof.transactionRecord.transactionOrder.payload.attributes.targetUnitId.bytes,
      MoneyPartitionUnitType.FEE_CREDIT_RECORD,
    );

    console.log('Adding fee credit');
    const addFeeCreditTransactionOrder = await (
      await UnsignedAddFeeCreditTransactionOrder.create(
        {
          ownerPredicate: ownerPredicate,
          proof: proof,
          feeCreditRecord: { unitId: feeCreditRecordId },
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);

    const addFeeCreditHash = await moneyClient.sendTransaction(addFeeCreditTransactionOrder);

    await moneyClient.waitTransactionProof(addFeeCreditHash, AddFeeCreditTransactionRecordWithProof);
    console.log('Adding fee credit successful');
  }, 20000);

  it('Lock and unlock fee credit', async () => {
    const feeCreditRecord = (await moneyClient.getUnit(feeCreditRecordId, false, FeeCreditRecord))!;
    expect(feeCreditRecord.locked).toBe(false);
    const round = await moneyClient.getRoundNumber();

    console.log('Locking fee credit...');
    const lockFeeCreditTransactionOrder = await (
      await UnsignedLockFeeCreditTransactionOrder.create(
        {
          status: 5n,
          feeCredit: feeCreditRecord,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);

    const lockFeeCreditHash = await moneyClient.sendTransaction(lockFeeCreditTransactionOrder);

    await moneyClient.waitTransactionProof(lockFeeCreditHash, LockFeeCreditTransactionRecordWithProof);
    console.log('Locking fee credit successful');
    const feeCreditAfterLock = (await moneyClient.getUnit(feeCreditRecordId, false, FeeCreditRecord))!;
    expect(feeCreditAfterLock.locked).toBe(true);

    console.log('Unlocking fee credit...');
    const unlockFeeCreditTransactionOrder = await (
      await UnsignedUnlockFeeCreditTransactionOrder.create(
        {
          feeCredit: feeCreditAfterLock,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);

    const unlockFeeCreditHash = await moneyClient.sendTransaction(unlockFeeCreditTransactionOrder);

    await moneyClient.waitTransactionProof(unlockFeeCreditHash, UnlockFeeCreditTransactionRecordWithProof);
    console.log('Unlocking fee credit successful');
    const feeCreditAfterUnlock = (await moneyClient.getUnit(feeCreditRecordId, false, FeeCreditRecord))!;
    expect(feeCreditAfterUnlock.locked).toBe(false);
  }, 20000);

  it('Lock and unlock bill', async () => {
    const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === Base16Converter.encode(new Uint8Array([MoneyPartitionUnitType.BILL])),
    );
    expect(billUnitIds.length).toBeGreaterThan(0);

    const round = await moneyClient.getRoundNumber();
    const bill = (await moneyClient.getUnit(billUnitIds[0], false, Bill))!;
    expect(bill).not.toBeNull();

    console.log('Locking bill...');
    const lockBillTransactionOrder = await (
      await UnsignedLockBillTransactionOrder.create(
        {
          status: 5n,
          bill: bill,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);

    const lockBillHash = await moneyClient.sendTransaction(lockBillTransactionOrder);
    await moneyClient.waitTransactionProof(lockBillHash, LockBillTransactionRecordWithProof);
    console.log('Locking bill successful');

    console.log('Unlocking bill...');
    const lockedBill = (await moneyClient.getUnit(bill.unitId, false, Bill))!;
    expect(lockedBill).not.toBeNull();
    expect(lockedBill.counter).not.toEqual(bill.counter);
    const unlockBillTransactionOrder = await (
      await UnsignedUnlockBillTransactionOrder.create(
        {
          bill: bill,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);
    const unlockBillHash = await moneyClient.sendTransaction(unlockBillTransactionOrder);
    await moneyClient.waitTransactionProof(unlockBillHash, UnlockBillTransactionRecordWithProof);
    console.log('Unlocking bill successful');
  }, 20000);

  it('Split and transfer bill', async () => {
    const round = await moneyClient.getRoundNumber();
    const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === Base16Converter.encode(new Uint8Array([MoneyPartitionUnitType.BILL])),
    );
    expect(billUnitIds.length).toBeGreaterThan(0);
    const billUnitId = billUnitIds[0];
    let bill = await moneyClient.getUnit(billUnitId, false, Bill);
    expect(bill).not.toBeNull();

    console.log('Splitting bill...');
    const splitBillTransactionOrder = await (
      await UnsignedSplitBillTransactionOrder.create(
        {
          splits: [
            {
              value: 10n,
              ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
            },
          ],
          bill: bill!,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);
    const splitBillHash = await moneyClient.sendTransaction(splitBillTransactionOrder);
    await moneyClient.waitTransactionProof(splitBillHash, SplitBillTransactionRecordWithProof);
    console.log('Splitting bill successful');

    bill = await moneyClient.getUnit(billUnitId, false, Bill);
    expect(bill!.value).toBeGreaterThan(0);

    const targetBillUnitId = billUnitIds
      .filter(
        (id) =>
          id.type.toBase16() === Base16Converter.encode(new Uint8Array([MoneyPartitionUnitType.BILL])) &&
          id.bytes !== bill!.unitId.bytes,
      )
      .at(0) as IUnitId;
    const targetBill = await moneyClient.getUnit(targetBillUnitId, false, Bill);

    console.log('Transferring bill...');
    const transferBillTransactionOrder = await (
      await UnsignedTransferBillTransactionOrder.create(
        {
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          bill: targetBill!,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);
    const transferBillHash = await moneyClient.sendTransaction(transferBillTransactionOrder);
    await moneyClient.waitTransactionProof(transferBillHash, TransferBillTransactionRecordWithProof);
    console.log('Transferring bill successful');
  }, 20000);

  it('Transfer and swap bill with dust collector', async () => {
    const round = await moneyClient.getRoundNumber();
    const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === Base16Converter.encode(new Uint8Array([MoneyPartitionUnitType.BILL])),
    );
    expect(billUnitIds.length).toBeGreaterThan(0);
    const bill = await moneyClient.getUnit(billUnitIds[0], false, Bill);
    expect(bill).not.toBeNull();

    const targetBillUnitId = billUnitIds
      .filter(
        (id) =>
          id.type.toBase16() === Base16Converter.encode(new Uint8Array([MoneyPartitionUnitType.BILL])) &&
          id.bytes !== bill!.unitId.bytes,
      )
      .at(0) as IUnitId;
    const targetBill = await moneyClient.getUnit(targetBillUnitId, false, Bill);
    expect(targetBill).not.toBeNull();

    console.log('Transferring bill to dust collector...');
    const transferBillToDcTransactionOrder = await (
      await UnsignedTransferBillToDustCollectorTransactionOrder.create(
        {
          bill: bill!,
          targetBill: targetBill!,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);
    const transferBillToDcHash = await moneyClient.sendTransaction(transferBillToDcTransactionOrder);
    const transactionProof = await moneyClient.waitTransactionProof(
      transferBillToDcHash,
      TransferBillToDustCollectorTransactionRecordWithProof,
    );
    console.log('Transferring bill to dust collector successful');

    console.log('Swapping bill with dust collector...');
    const swapBillWithDcTransactionOrder = await (
      await UnsignedSwapBillsWithDustCollectorTransactionOrder.create(
        {
          bill: targetBill!,
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          proofs: [transactionProof],
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);
    const swapBillWithDcHash = await moneyClient.sendTransaction(swapBillWithDcTransactionOrder);
    await moneyClient.waitTransactionProof(swapBillWithDcHash, SwapBillsWithDustCollectorTransactionRecordWithProof);
    console.log('Swapping bill successful');
  }, 20000);

  it('Close and reclaim fee credit', async () => {
    const round = await moneyClient.getRoundNumber();
    const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === Base16Converter.encode(new Uint8Array([MoneyPartitionUnitType.BILL])),
    );
    expect(billUnitIds.length).toBeGreaterThan(0);
    const billUnitId = billUnitIds[0];
    let bill = await moneyClient.getUnit(billUnitId, false, Bill);
    expect(bill).not.toBeNull();

    const feeCreditRecord = await moneyClient.getUnit(feeCreditRecordId, false, FeeCreditRecord);
    console.log('Closing fee credit...');
    const closeFeeCreditTransactionOrder = await (
      await UnsignedCloseFeeCreditTransactionOrder.create(
        {
          bill: bill!,
          feeCreditRecord: feeCreditRecord!,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);
    const closeFeeCreditHash = await moneyClient.sendTransaction(closeFeeCreditTransactionOrder);
    const proof = await moneyClient.waitTransactionProof(closeFeeCreditHash, CloseFeeCreditTransactionRecordWithProof);
    console.log('Closing fee credit successful');

    bill = await moneyClient.getUnit(billUnitId, false, Bill);
    console.log('Reclaiming fee credit...');
    const reclaimFeeCreditTransactionOrder = await (
      await UnsignedReclaimFeeCreditTransactionOrder.create(
        {
          proof: proof,
          bill: bill!,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      )
    ).sign(signingService, signingService);
    const reclaimFeeCreditHash = await moneyClient.sendTransaction(reclaimFeeCreditTransactionOrder);
    await moneyClient.waitTransactionProof(reclaimFeeCreditHash, ReclaimFeeCreditTransactionRecordWithProof);
    console.log('Reclaiming fee credit successful');
  }, 20000);
});

// TODO: Remove test
describe('spend initial bill', () => {
  it('', async () => {
    const cborCodec = new CborCodecNode();
    const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
    const proofSigningService = new AlwaysTrueProofSigningService(cborCodec);

    const moneyClient = createMoneyClient({
      transport: http(config.moneyPartitionUrl, cborCodec),
    });

    const initialBillId = UnitIdWithType.fromBytes(
      Base16Converter.decode('0x000000000000000000000000000000000000000000000000000000000000000001'),
    );
    let bill = await moneyClient.getUnit(initialBillId, false, Bill);
    const round = await moneyClient.getRoundNumber();

    const transferFeeCreditTransactionHash = await moneyClient.sendTransaction(
      await UnsignedTransferFeeCreditTransactionOrder.create(
        {
          amount: 100n,
          targetSystemIdentifier: SystemIdentifier.MONEY_PARTITION,
          latestAdditionTime: round + 60n,
          feeCreditRecord: {
            ownerPredicate: new AlwaysTruePredicate(),
            unitType: MoneyPartitionUnitType.FEE_CREDIT_RECORD,
          },
          bill: bill!,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(proofSigningService, proofSigningService)),
    );

    const transactionProof = await moneyClient.waitTransactionProof(
      transferFeeCreditTransactionHash,
      TransferFeeCreditTransactionRecordWithProof,
    );
    const feeCreditRecordId = transactionProof.transactionRecord.transactionOrder.payload.attributes.targetUnitId;

    const addFeeCreditTransactionHash = await moneyClient.sendTransaction(
      await UnsignedAddFeeCreditTransactionOrder.create(
        {
          ownerPredicate: new AlwaysTruePredicate(),
          proof: transactionProof,
          feeCreditRecord: { unitId: feeCreditRecordId },
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(proofSigningService, proofSigningService)),
    );

    await moneyClient.waitTransactionProof(addFeeCreditTransactionHash, AddFeeCreditTransactionRecordWithProof);

    bill = await moneyClient.getUnit(initialBillId, false, Bill);

    await moneyClient.sendTransaction(
      await UnsignedTransferBillTransactionOrder.create(
        {
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          bill: bill!,
          networkIdentifier: NetworkIdentifier.LOCAL,
          stateLock: null,
          metadata: createMetadata(round),
          stateUnlock: new AlwaysTruePredicate(),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(proofSigningService, proofSigningService)),
    );
  }, 20000);
});
