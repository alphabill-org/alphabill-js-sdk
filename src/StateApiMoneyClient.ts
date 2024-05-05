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
  data: { unitId: IUnitId; backlink: Uint8Array };
}

export interface IUnlockUnitTransactionData {
  data: { unitId: IUnitId; backlink: Uint8Array };
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

export class StateApiMoneyClient extends StateApiClient {
  public constructor(
    private readonly transactionOrderFactory: ITransactionOrderFactory,
    service: IStateApiService,
  ) {
    super(service);
  }

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

  public async lockBill(
    { status, data }: ILockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          data.unitId,
          new LockBillAttributes(status, data.backlink),
          metadata,
        ),
      ),
    );
  }

  public async lockFeeCredit(
    { status, data }: ILockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          data.unitId,
          new LockFeeCreditAttributes(status, data.backlink),
          metadata,
        ),
      ),
    );
  }

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

  public async unlockBill(
    { data }: IUnlockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          data.unitId,
          new UnlockBillAttributes(data.backlink),
          metadata,
        ),
      ),
    );
  }

  public async unlockFeeCredit(
    { data }: IUnlockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.MONEY_PARTITION,
          data.unitId,
          new UnlockFeeCreditAttributes(data.backlink),
          metadata,
        ),
      ),
    );
  }
}
