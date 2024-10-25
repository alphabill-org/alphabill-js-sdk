import { FeeCreditRecord } from '../fees/FeeCreditRecord.js';
import { AddFeeCreditTransactionOrder } from '../fees/transactions/AddFeeCreditTransactionOrder.js';
import { CloseFeeCreditTransactionOrder } from '../fees/transactions/CloseFeeCreditTransactionOrder.js';
import { LockFeeCreditTransactionOrder } from '../fees/transactions/LockFeeCreditTransactionOrder.js';
import { ReclaimFeeCreditTransactionOrder } from '../fees/transactions/ReclaimFeeCreditTransactionOrder.js';
import { AddFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/AddFeeCreditTransactionRecordWithProof.js';
import { CloseFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/CloseFeeCreditTransactionRecordWithProof.js';
import { LockFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/LockFeeCreditTransactionRecordWithProof.js';
import { ReclaimFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/ReclaimFeeCreditTransactionRecordWithProof.js';
import { TransferFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/TransferFeeCreditTransactionRecordWithProof.js';
import { UnlockFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/UnlockFeeCreditTransactionRecordWithProof.js';
import { TransferFeeCreditTransactionOrder } from '../fees/transactions/TransferFeeCreditTransactionOrder.js';
import { UnlockFeeCreditTransactionOrder } from '../fees/transactions/UnlockFeeCreditTransactionOrder.js';
import { IUnitId } from '../IUnitId.js';
import { Bill } from '../money/Bill.js';
import { LockBillTransactionOrder } from '../money/transactions/LockBillTransactionOrder.js';
import { LockBillTransactionRecordWithProof } from '../money/transactions/LockBillTransactionRecordWithProof.js';
import { SplitBillTransactionOrder } from '../money/transactions/SplitBillTransactionOrder.js';
import { SplitBillTransactionRecordWithProof } from '../money/transactions/SplitBillTransactionRecordWithProof.js';
import { SwapBillsWithDustCollectorTransactionOrder } from '../money/transactions/SwapBillsWithDustCollectorTransactionOrder.js';
import { SwapBillsWithDustCollectorTransactionRecordWithProof } from '../money/transactions/SwapBillsWithDustCollectorTransactionRecordWithProof.js';
import { TransferBillToDustCollectorTransactionOrder } from '../money/transactions/TransferBillToDustCollectorTransactionOrder.js';
import { TransferBillToDustCollectorTransactionRecordWithProof } from '../money/transactions/TransferBillToDustCollectorTransactionRecordWithProof.js';
import { TransferBillTransactionOrder } from '../money/transactions/TransferBillTransactionOrder.js';
import { TransferBillTransactionRecordWithProof } from '../money/transactions/TransferBillTransactionRecordWithProof.js';
import { UnlockBillTransactionOrder } from '../money/transactions/UnlockBillTransactionOrder.js';
import { UnlockBillTransactionRecordWithProof } from '../money/transactions/UnlockBillTransactionRecordWithProof.js';
import { IBillDataDto } from './IBillDataDto.js';
import { IFeeCreditRecordDto } from './IFeeCreditRecordDto.js';
import { CreateTransactionRecordWithProof, CreateUnit, JsonRpcClient } from './JsonRpcClient.js';
import { MoneyPartitionUnitIdList } from './MoneyPartitionUnitIdList.js';

type MoneyPartitionUnitTypes = Bill | FeeCreditRecord;

type UnitDto<T extends MoneyPartitionUnitTypes> = T extends Bill
  ? IBillDataDto
  : T extends FeeCreditRecord
    ? IFeeCreditRecordDto
    : never;

export type MoneyPartitionTransactionRecordWithProofTypes =
  | AddFeeCreditTransactionRecordWithProof
  | CloseFeeCreditTransactionRecordWithProof
  | LockBillTransactionRecordWithProof
  | LockFeeCreditTransactionRecordWithProof
  | ReclaimFeeCreditTransactionRecordWithProof
  | SplitBillTransactionRecordWithProof
  | SwapBillsWithDustCollectorTransactionRecordWithProof
  | TransferBillToDustCollectorTransactionRecordWithProof
  | TransferBillTransactionRecordWithProof
  | TransferFeeCreditTransactionRecordWithProof
  | UnlockBillTransactionRecordWithProof
  | UnlockFeeCreditTransactionRecordWithProof;

type MoneyPartitionTransactionOrderTypes =
  | AddFeeCreditTransactionOrder
  | CloseFeeCreditTransactionOrder
  | LockBillTransactionOrder
  | LockFeeCreditTransactionOrder
  | ReclaimFeeCreditTransactionOrder
  | SplitBillTransactionOrder
  | SwapBillsWithDustCollectorTransactionOrder
  | TransferBillToDustCollectorTransactionOrder
  | TransferBillTransactionOrder
  | TransferFeeCreditTransactionOrder
  | UnlockBillTransactionOrder
  | UnlockFeeCreditTransactionOrder;

/**
 * JSON-RPC money partition client.
 */
export class MoneyPartitionJsonRpcClient {
  public constructor(private readonly client: JsonRpcClient) {}

  /**
   * @see {JsonRpcClient.getRoundNumber}
   */
  public getRoundNumber(): Promise<bigint> {
    return this.client.getRoundNumber();
  }

  /**
   * @see {JsonRpcClient.getUnitsByOwnerId}
   */
  public async getUnitsByOwnerId(ownerId: Uint8Array): Promise<MoneyPartitionUnitIdList> {
    return new MoneyPartitionUnitIdList(await this.client.getUnitsByOwnerId(ownerId));
  }

  /**
   * @see {JsonRpcClient.getBlock}
   */
  public getBlock(blockNumber: bigint): Promise<Uint8Array> {
    return this.client.getBlock(blockNumber);
  }

  /**
   * @see {JsonRpcClient.getUnit}
   */
  public getUnit<T extends MoneyPartitionUnitTypes>(
    unitId: IUnitId,
    includeStateProof: boolean,
    factory: CreateUnit<T, UnitDto<T>>,
  ): Promise<T | null> {
    return this.client.getUnit(unitId, includeStateProof, factory);
  }

  /**
   * @see {JsonRpcClient.getTransactionProof}
   */
  public getTransactionProof<TRP extends MoneyPartitionTransactionRecordWithProofTypes>(
    transactionHash: Uint8Array,
    factory: CreateTransactionRecordWithProof<TRP>,
  ): Promise<TRP | null> {
    return this.client.getTransactionProof(transactionHash, factory);
  }

  /**
   * @see {JsonRpcClient.waitTransactionProof}
   */
  public waitTransactionProof<TRP extends MoneyPartitionTransactionRecordWithProofTypes>(
    transactionHash: Uint8Array,
    factory: CreateTransactionRecordWithProof<TRP>,
  ): Promise<TRP> {
    return this.client.waitTransactionProof(transactionHash, factory);
  }

  /**
   * @see {JsonRpcClient.sendTransaction}
   */
  public sendTransaction(transaction: MoneyPartitionTransactionOrderTypes): Promise<Uint8Array> {
    return this.client.sendTransaction(transaction);
  }
}
