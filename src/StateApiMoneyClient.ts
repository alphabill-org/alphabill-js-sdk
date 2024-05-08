import { IStateApiService } from './IStateApiService.js';
import { IUnitId } from './IUnitId.js';
import { StateApiClient } from './StateApiClient.js';
import { SystemIdentifier } from './SystemIdentifier.js';
import { AddFeeCreditAttributes } from './transaction/AddFeeCreditAttributes.js';
import { CloseFeeCreditAttributes } from './transaction/CloseFeeCreditAttributes.js';
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
import { UnlockBillAttributes } from './transaction/UnlockBillAttributes.js';
import { UnlockFeeCreditAttributes } from './transaction/UnlockFeeCreditAttributes.js';
import { TransactionRecordWithProof } from './TransactionRecordWithProof.js';

interface ITransferFeeCreditTransactionData {
  amount: bigint;
  systemIdentifier: SystemIdentifier;
  earliestAdditionTime: bigint;
  latestAdditionTime: bigint;
  feeCreditRecord: { unitId: IUnitId; backlink: Uint8Array | null };
  bill: { unitId: IUnitId; backlink: Uint8Array };
}

export interface ILockUnitTransactionData {
  status: bigint;
  unit: { unitId: IUnitId; backlink: Uint8Array };
}

export interface IUnlockUnitTransactionData {
  unit: { unitId: IUnitId; backlink: Uint8Array };
}

interface IReclaimFeeCreditTransactionData {
  proof: TransactionRecordWithProof<TransactionPayload<CloseFeeCreditAttributes>>;
  bill: { unitId: IUnitId; backlink: Uint8Array };
}

interface ISplitBillTransactionData {
  splits: { value: bigint; ownerPredicate: IPredicate }[];
  bill: { unitId: IUnitId; backlink: Uint8Array; value: bigint };
}

interface ITransferBillToDustCollectorTransactionData {
  bill: { unitId: IUnitId; backlink: Uint8Array; value: bigint };
  targetBill: { unitId: IUnitId; backlink: Uint8Array; value: bigint };
}

interface ISwapBillsWithDustCollectorTransactionData {
  ownerPredicate: IPredicate;
  proofs: TransactionRecordWithProof<TransactionPayload<TransferBillToDustCollectorAttributes>>[];
  bill: { unitId: IUnitId; backlink: Uint8Array };
}

interface ITransferBillTransactionData {
  ownerPredicate: IPredicate;
  bill: { unitId: IUnitId; backlink: Uint8Array; value: bigint };
}

export interface IAddFeeCreditTransactionData {
  ownerPredicate: IPredicate;
  proof: TransactionRecordWithProof<TransactionPayload<TransferFeeCreditAttributes>>;
  feeCreditRecord: { unitId: IUnitId };
}

export interface ICloseFeeCreditTransactionData {
  amount: bigint;
  bill: { unitId: IUnitId; backlink: Uint8Array };
  feeCreditRecord: { unitId: IUnitId; balance: bigint };
}

/**
 * State API client for money partition.
 */
export class StateApiMoneyClient extends StateApiClient {
  /**
   * State API client for money partition constructor.
   * @param transactionOrderFactory Transaction order factory.
   * @param service State API service.
   */
  public constructor(
    private readonly transactionOrderFactory: ITransactionOrderFactory,
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
    {
      bill,
      amount,
      systemIdentifier,
      feeCreditRecord,
      earliestAdditionTime,
      latestAdditionTime,
    }: ITransferFeeCreditTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          bill.unitId,
          new TransferFeeCreditAttributes(
            amount,
            systemIdentifier,
            feeCreditRecord.unitId,
            earliestAdditionTime,
            latestAdditionTime,
            feeCreditRecord.backlink,
            bill.backlink,
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
          new LockBillAttributes(status, unit.backlink),
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
          new LockFeeCreditAttributes(status, unit.backlink),
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
          new CloseFeeCreditAttributes(feeCreditRecord.balance, bill.unitId, bill.backlink),
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
          new ReclaimFeeCreditAttributes(proof, bill.backlink),
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
            bill.backlink,
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
          new TransferBillToDustCollectorAttributes(bill.value, targetBill.unitId, targetBill.backlink, bill.backlink),
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
          new TransferBillAttributes(ownerPredicate, bill.value, bill.backlink),
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
          new UnlockBillAttributes(unit.backlink),
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
          new UnlockFeeCreditAttributes(unit.backlink),
          metadata,
        ),
      ),
    );
  }
}
