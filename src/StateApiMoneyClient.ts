import { FeeCreditRecord } from './FeeCreditRecord.js';
import { IStateApiService } from './IStateApiService.js';
import { IUnitId } from './IUnitId.js';
import { StateApiClient } from './StateApiClient.js';
import { SystemIdentifier } from './SystemIdentifier.js';
import { AddFeeCreditAttributes } from './transaction/AddFeeCreditAttributes.js';
import { CloseFeeCreditAttributes } from './transaction/CloseFeeCreditAttributes.js';
import { FeeCreditRecordUnitIdFactory } from './transaction/FeeCreditRecordUnitIdFactory.js';
import { IPredicate } from './transaction/IPredicate.js';
import { ITransactionClientMetadata } from './transaction/ITransactionClientMetadata.js';
import { ITransactionOrderFactory } from './transaction/ITransactionOrderFactory.js';
import { LockBillAttributes } from './transaction/LockBillAttributes.js';
import { LockFeeCreditAttributes } from './transaction/LockFeeCreditAttributes.js';
import { ReclaimFeeCreditAttributes } from './transaction/ReclaimFeeCreditAttributes.js';
import { SplitBillAttributes } from './transaction/SplitBillAttributes.js';
import { SplitBillUnit } from './transaction/SplitBillUnit.js';
import { SwapBillsWithDustCollectorAttributes } from './transaction/SwapBillsWithDustCollectorAttributes.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { TransferBillAttributes } from './transaction/TransferBillAttributes.js';
import { TransferBillToDustCollectorAttributes } from './transaction/TransferBillToDustCollectorAttributes.js';
import { TransferFeeCreditAttributes } from './transaction/TransferFeeCreditAttributes.js';
import { UnitType } from './transaction/UnitType.js';
import { UnlockBillAttributes } from './transaction/UnlockBillAttributes.js';
import { UnlockFeeCreditAttributes } from './transaction/UnlockFeeCreditAttributes.js';
import { TransactionRecordWithProof } from './TransactionRecordWithProof.js';

interface ITransferFeeCreditTransactionData {
  amount: bigint;
  systemIdentifier: SystemIdentifier;
  latestAdditionTime: bigint;
  feeCreditRecordParams: {
    ownerPredicate: IPredicate;
    unitType: UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD | UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD;
  };
  bill: { unitId: IUnitId; counter: bigint };
}

export interface ILockUnitTransactionData {
  status: bigint;
  unit: { unitId: IUnitId; counter: bigint };
}

export interface IUnlockUnitTransactionData {
  unit: { unitId: IUnitId; counter: bigint };
}

interface IReclaimFeeCreditTransactionData {
  proof: TransactionRecordWithProof<TransactionPayload<CloseFeeCreditAttributes>>;
  bill: { unitId: IUnitId; counter: bigint };
}

interface ISplitBillTransactionData {
  splits: { value: bigint; ownerPredicate: IPredicate }[];
  bill: { unitId: IUnitId; counter: bigint; value: bigint };
}

interface ITransferBillToDustCollectorTransactionData {
  bill: { unitId: IUnitId; counter: bigint; value: bigint };
  targetBill: { unitId: IUnitId; counter: bigint; value: bigint };
}

interface ISwapBillsWithDustCollectorTransactionData {
  ownerPredicate: IPredicate;
  proofs: TransactionRecordWithProof<TransactionPayload<TransferBillToDustCollectorAttributes>>[];
  bill: { unitId: IUnitId };
}

interface ITransferBillTransactionData {
  ownerPredicate: IPredicate;
  bill: { unitId: IUnitId; counter: bigint; value: bigint };
}

export interface IAddFeeCreditTransactionData {
  ownerPredicate: IPredicate;
  proof: TransactionRecordWithProof<TransactionPayload<TransferFeeCreditAttributes>>;
  feeCreditRecord: { unitId: IUnitId };
}

export interface ICloseFeeCreditTransactionData {
  amount: bigint;
  bill: { unitId: IUnitId; counter: bigint };
  feeCreditRecord: { unitId: IUnitId; balance: bigint; counter: bigint };
}

/**
 * State API client for money partition.
 */
export class StateApiMoneyClient extends StateApiClient {
  /**
   * State API client for money partition constructor.
   * @param transactionOrderFactory Transaction order factory.
   * @param feeCreditRecordUnitIdFactory Fee credit record unit ID factory.
   * @param service State API service.
   */
  public constructor(
    private readonly transactionOrderFactory: ITransactionOrderFactory,
    private readonly feeCreditRecordUnitIdFactory: FeeCreditRecordUnitIdFactory,
    service: IStateApiService,
  ) {
    super(service);
  }

  /**
   * Transfer fee credit from bill.
   * @param {ITransferFeeCreditTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async transferToFeeCredit(
    { bill, amount, systemIdentifier, feeCreditRecordParams, latestAdditionTime }: ITransferFeeCreditTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    const feeCreditRecordId = this.feeCreditRecordUnitIdFactory.create(
      metadata.timeout,
      feeCreditRecordParams.ownerPredicate,
      feeCreditRecordParams.unitType,
    );
    const feeCreditRecord: FeeCreditRecord | null = await this.getUnit(feeCreditRecordId, false);
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          bill.unitId,
          new TransferFeeCreditAttributes(
            amount,
            systemIdentifier,
            feeCreditRecordId,
            latestAdditionTime,
            feeCreditRecord?.counter ?? 0n,
            bill.counter,
          ),
          metadata,
        ),
      ),
    );
  }

  /**
   * Add fee credit.
   * @param {IAddFeeCreditTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async addFeeCredit(
    { ownerPredicate, proof, feeCreditRecord }: IAddFeeCreditTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          feeCreditRecord.unitId,
          new AddFeeCreditAttributes(ownerPredicate, proof),
          metadata,
        ),
      ),
    );
  }

  /**
   * Lock bill.
   * @param {ILockUnitTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async lockBill(
    { status, unit }: ILockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          unit.unitId,
          new LockBillAttributes(status, unit.counter),
          metadata,
        ),
      ),
    );
  }

  /**
   * Lock fee credit.
   * @param {ILockUnitTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async lockFeeCredit(
    { status, unit }: ILockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          unit.unitId,
          new LockFeeCreditAttributes(status, unit.counter),
          metadata,
        ),
      ),
    );
  }

  /**
   * Close fee credit.
   * @param {ICloseFeeCreditTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async closeFeeCredit(
    { bill, feeCreditRecord }: ICloseFeeCreditTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          feeCreditRecord.unitId,
          new CloseFeeCreditAttributes(feeCreditRecord.balance, bill.unitId, bill.counter, feeCreditRecord.counter),
          metadata,
        ),
      ),
    );
  }

  /**
   * Reclaim fee credit.
   * @param {IReclaimFeeCreditTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async reclaimFeeCredit(
    { proof, bill }: IReclaimFeeCreditTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          bill.unitId,
          new ReclaimFeeCreditAttributes(proof, bill.counter),
          metadata,
        ),
      ),
    );
  }

  /**
   * Split bill.
   * @param {ISplitBillTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async splitBill(
    { splits, bill }: ISplitBillTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          bill.unitId,
          new SplitBillAttributes(
            splits.map(({ value, ownerPredicate }) => new SplitBillUnit(value, ownerPredicate)),
            splits.reduce((previousValue, currentValue) => previousValue - currentValue.value, bill.value),
            bill.counter,
          ),
          metadata,
        ),
      ),
    );
  }

  /**
   * Transfer bill to dust collector.
   * @param {ISplitBillTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async transferBillToDustCollector(
    { bill, targetBill }: ITransferBillToDustCollectorTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          bill.unitId,
          new TransferBillToDustCollectorAttributes(bill.value, targetBill.unitId, targetBill.counter, bill.counter),
          metadata,
        ),
      ),
    );
  }

  /**
   * Swap bills with dust collector.
   * @param {ISwapBillsWithDustCollectorTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async swapBillsWithDustCollector(
    { bill, ownerPredicate, proofs }: ISwapBillsWithDustCollectorTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          bill.unitId,
          new SwapBillsWithDustCollectorAttributes(
            ownerPredicate,
            proofs,
            proofs.reduce(
              (previousValue, currentValue) =>
                previousValue + currentValue.transactionRecord.transactionOrder.payload.attributes.value,
              0n,
            ),
          ),
          metadata,
        ),
      ),
    );
  }

  /**
   * Transfer bill.
   * @param {ITransferBillTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async transferBill(
    { ownerPredicate, bill }: ITransferBillTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          bill.unitId,
          new TransferBillAttributes(ownerPredicate, bill.value, bill.counter),
          metadata,
        ),
      ),
    );
  }

  /**
   * Unlock bill.
   * @param {IUnlockUnitTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async unlockBill(
    { unit }: IUnlockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          unit.unitId,
          new UnlockBillAttributes(unit.counter),
          metadata,
        ),
      ),
    );
  }

  /**
   * Unlock fee credits.
   * @param {IUnlockUnitTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async unlockFeeCredit(
    { unit }: IUnlockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          unit.unitId,
          new UnlockFeeCreditAttributes(unit.counter),
          metadata,
        ),
      ),
    );
  }
}
