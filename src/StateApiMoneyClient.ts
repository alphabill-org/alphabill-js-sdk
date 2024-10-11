import { IStateApiService } from './IStateApiService.js';
import { IUnitId } from './IUnitId.js';
import { ISigningService } from './signing/ISigningService.js';
import { StateApiClient } from './StateApiClient.js';
import { SystemIdentifier } from './SystemIdentifier.js';
import { AddFeeCreditAttributes } from './transaction/attribute/AddFeeCreditAttributes.js';
import { CloseFeeCreditAttributes } from './transaction/attribute/CloseFeeCreditAttributes.js';
import { LockBillAttributes } from './transaction/attribute/LockBillAttributes.js';
import { LockFeeCreditAttributes } from './transaction/attribute/LockFeeCreditAttributes.js';
import { ReclaimFeeCreditAttributes } from './transaction/attribute/ReclaimFeeCreditAttributes.js';
import { SplitBillAttributes } from './transaction/attribute/SplitBillAttributes.js';
import { SwapBillsWithDustCollectorAttributes } from './transaction/attribute/SwapBillsWithDustCollectorAttributes.js';
import { TransferBillAttributes } from './transaction/attribute/TransferBillAttributes.js';
import { TransferBillToDustCollectorAttributes } from './transaction/attribute/TransferBillToDustCollectorAttributes.js';
import { TransferFeeCreditAttributes } from './transaction/attribute/TransferFeeCreditAttributes.js';
import { UnlockBillAttributes } from './transaction/attribute/UnlockBillAttributes.js';
import { UnlockFeeCreditAttributes } from './transaction/attribute/UnlockFeeCreditAttributes.js';
import { ITransactionClientMetadata } from './transaction/ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { IUnsignedTransactionOrder } from './transaction/order/IUnsignedTransactionOrder.js';
import { TransactionOrder } from './transaction/order/TransactionOrder.js';
import { UnsignedTransferFeeCreditTransactionOrder } from './transaction/order/UnsignedTransferFeeCreditTransactionOrder.js';
import { IPredicate } from './transaction/predicate/IPredicate.js';
import { TransactionRecordWithProof } from './transaction/record/TransactionRecordWithProof.js';
import { SplitBillUnit } from './transaction/SplitBillUnit.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';

interface ITransferFeeCreditTransactionData {
  amount: bigint;
  systemIdentifier: SystemIdentifier;
  latestAdditionTime: bigint;
  feeCreditRecord: {
    unitId: IUnitId;
    counter: bigint;
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
  proof: TransactionRecordWithProof<CloseFeeCreditAttributes>;
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
  proofs: TransactionRecordWithProof<TransferBillToDustCollectorAttributes>[];
  bill: { unitId: IUnitId };
}

interface ITransferBillTransactionData {
  ownerPredicate: IPredicate;
  bill: { unitId: IUnitId; counter: bigint; value: bigint };
}

export interface IAddFeeCreditTransactionData {
  ownerPredicate: IPredicate;
  proof: TransactionRecordWithProof<TransferFeeCreditAttributes>;
  feeCreditRecord: { unitId: IUnitId };
}

export interface ICloseFeeCreditTransactionData {
  bill: { unitId: IUnitId; counter: bigint };
  feeCreditRecord: { unitId: IUnitId; balance: bigint; counter: bigint };
}

// THIS OR PUT ON METHOD
class UnsignedTransactionRequest {
  public constructor(
    private readonly client: StateApiClient,
    private readonly unsignedTransactionOrder: IUnsignedTransactionOrder<ITransactionPayloadAttributes>,
  ) {}

  public sign(ownerProofSigner: ISigningService, feeProofSigner: ISigningService): SignedTransactionRequest {
    return new SignedTransactionRequest(
      this.client,
      this.unsignedTransactionOrder.sign(ownerProofSigner, feeProofSigner),
    );
  }
}

class SignedTransactionRequest {
  public constructor(
    private readonly client: StateApiClient,
    private readonly signedTransactionOrderPromise: Promise<TransactionOrder<ITransactionPayloadAttributes>>,
  ) {}

  public send(): Promise<Uint8Array> {
    return this.signedTransactionOrderPromise.then((transactionOrder) => this.client.sendTransaction(transactionOrder));
  }
}

/**
 * State API client for money partition.
 */
export class StateApiMoneyClient extends StateApiClient {
  /**
   * State API client for money partition constructor.
   * @param service State API service.
   */
  public constructor(service: IStateApiService) {
    super(service);
  }

  /**
   * Transfer fee credit from bill.
   * @param {ITransferFeeCreditTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async transferToFeeCredit(
    { bill, amount, systemIdentifier, feeCreditRecord, latestAdditionTime }: ITransferFeeCreditTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return new UnsignedTransactionRequest(
      this,
      new UnsignedTransferFeeCreditTransactionOrder(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          bill.unitId,
          new TransferFeeCreditAttributes(
            amount,
            systemIdentifier,
            feeCreditRecord.unitId,
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
