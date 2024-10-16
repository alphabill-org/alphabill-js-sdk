import { CborCodecNode } from '../../../src/codec/cbor/CborCodecNode.js';
import { FeeCreditRecord } from '../../../src/fees/FeeCreditRecord.js';
import { AddFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/AddFeeCreditTransactionRecordWithProof.js';
import { CloseFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/CloseFeeCreditTransactionRecordWithProof.js';
import { LockFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/LockFeeCreditTransactionRecordWithProof.js';
import { ReclaimFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/ReclaimFeeCreditTransactionRecordWithProof.js';
import { TransferFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/TransferFeeCreditTransactionRecordWithProof.js';
import { UnlockFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/UnlockFeeCreditTransactionRecordWithProof.js';
import { UnsignedAddFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedAddFeeCreditTransactionOrder.js';
import { UnsignedCloseFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedCloseFeeCreditTransactionOrder.js';
import { UnsignedLockFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedLockFeeCreditTransactionOrder.js';
import { UnsignedReclaimFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedReclaimFeeCreditTransactionOrder.js';
import { UnsignedTransferFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedTransferFeeCreditTransactionOrder.js';
import { UnsignedUnlockFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedUnlockFeeCreditTransactionOrder.js';
import { IUnitId } from '../../../src/IUnitId.js';
import { Bill } from '../../../src/money/Bill.js';
import { MoneyPartitionUnitType } from '../../../src/money/MoneyPartitionUnitType.js';
import { DefaultSigningService } from '../../../src/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '../../../src/StateApiClientFactory.js';
import { SystemIdentifier } from '../../../src/SystemIdentifier.js';
import { PayToPublicKeyHashPredicate } from '../../../src/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { PayToPublicKeyHashProofFactory } from '../../../src/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../../src/transaction/record/TransactionStatus.js';
import { Base16Converter } from '../../../src/util/Base16Converter.js';
import config from '../config/config.js';
import { createTransactionData } from '../utils/TestUtils.js';

describe('Fee Credit Integration Tests', () => {
  const cborCodec = new CborCodecNode();
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const proofFactory = new PayToPublicKeyHashProofFactory(signingService, cborCodec);

  const moneyClient = createMoneyClient({
    transport: http(config.moneyPartitionUrl, new CborCodecNode()),
  });

  let feeCreditRecordId: IUnitId; // can no longer be static as hash contains timeout

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
          ...createTransactionData(round),
        },
        cborCodec,
      )
    ).sign(proofFactory);

    const transferFeeCreditHash = await moneyClient.sendTransaction(transferFeeCreditTransactionOrder);

    const transferFeeCreditProof = await moneyClient.waitTransactionProof(
      transferFeeCreditHash,
      TransferFeeCreditTransactionRecordWithProof,
    );
    expect(transferFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(
      TransactionStatus.Successful,
    );
    console.log('Transfer to fee credit successful');

    feeCreditRecordId = transferFeeCreditTransactionOrder.payload.attributes.targetUnitId;

    console.log('Adding fee credit');
    const addFeeCreditTransactionOrder = await (
      await UnsignedAddFeeCreditTransactionOrder.create(
        {
          targetSystemIdentifier: SystemIdentifier.MONEY_PARTITION,
          ownerPredicate: ownerPredicate,
          proof: transferFeeCreditProof,
          feeCreditRecord: { unitId: feeCreditRecordId },
          ...createTransactionData(round),
        },
        cborCodec,
      )
    ).sign(proofFactory);

    const addFeeCreditHash = await moneyClient.sendTransaction(addFeeCreditTransactionOrder);

    const addFeeCreditProof = await moneyClient.waitTransactionProof(
      addFeeCreditHash,
      AddFeeCreditTransactionRecordWithProof,
    );
    expect(addFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
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
          ...createTransactionData(round),
        },
        cborCodec,
      )
    ).sign(proofFactory);

    const lockFeeCreditHash = await moneyClient.sendTransaction(lockFeeCreditTransactionOrder);

    const lockFeeCreditProof = await moneyClient.waitTransactionProof(
      lockFeeCreditHash,
      LockFeeCreditTransactionRecordWithProof,
    );
    expect(lockFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Locking fee credit successful');
    const feeCreditAfterLock = (await moneyClient.getUnit(feeCreditRecordId, false, FeeCreditRecord))!;
    expect(feeCreditAfterLock.locked).toBe(true);

    console.log('Unlocking fee credit...');
    const unlockFeeCreditTransactionOrder = await (
      await UnsignedUnlockFeeCreditTransactionOrder.create(
        {
          feeCredit: feeCreditAfterLock,
          ...createTransactionData(round),
        },
        cborCodec,
      )
    ).sign(proofFactory);

    const unlockFeeCreditHash = await moneyClient.sendTransaction(unlockFeeCreditTransactionOrder);

    const unlockFeeCreditProof = await moneyClient.waitTransactionProof(
      unlockFeeCreditHash,
      UnlockFeeCreditTransactionRecordWithProof,
    );
    expect(unlockFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(
      TransactionStatus.Successful,
    );
    console.log('Unlocking fee credit successful');
    const feeCreditAfterUnlock = (await moneyClient.getUnit(feeCreditRecordId, false, FeeCreditRecord))!;
    expect(feeCreditAfterUnlock.locked).toBe(false);
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
          ...createTransactionData(round),
        },
        cborCodec,
      )
    ).sign(proofFactory);
    const closeFeeCreditHash = await moneyClient.sendTransaction(closeFeeCreditTransactionOrder);
    const closeFeeCreditProof = await moneyClient.waitTransactionProof(
      closeFeeCreditHash,
      CloseFeeCreditTransactionRecordWithProof,
    );
    expect(closeFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Closing fee credit successful');

    bill = await moneyClient.getUnit(billUnitId, false, Bill);
    console.log('Reclaiming fee credit...');
    const reclaimFeeCreditTransactionOrder = await (
      await UnsignedReclaimFeeCreditTransactionOrder.create(
        {
          proof: closeFeeCreditProof,
          bill: bill!,
          ...createTransactionData(round),
        },
        cborCodec,
      )
    ).sign(proofFactory);
    const reclaimFeeCreditHash = await moneyClient.sendTransaction(reclaimFeeCreditTransactionOrder);
    const reclaimFeeCreditProof = await moneyClient.waitTransactionProof(
      reclaimFeeCreditHash,
      ReclaimFeeCreditTransactionRecordWithProof,
    );
    expect(reclaimFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(
      TransactionStatus.Successful,
    );
    console.log('Reclaiming fee credit successful');
  }, 20000);
});
