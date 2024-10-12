import { IUnitId } from '../IUnitId.js';
import { AddFeeCreditTransactionOrder } from '../transaction/order/types/AddFeeCreditTransactionOrder.js';
import { CloseFeeCreditTransactionOrder } from '../transaction/order/types/CloseFeeCreditTransactionOrder.js';
import { LockBillTransactionOrder } from '../transaction/order/types/LockBillTransactionOrder.js';
import { LockFeeCreditTransactionOrder } from '../transaction/order/types/LockFeeCreditTransactionOrder.js';
import { ReclaimFeeCreditTransactionOrder } from '../transaction/order/types/ReclaimFeeCreditTransactionOrder.js';
import { SplitBillTransactionOrder } from '../transaction/order/types/SplitBillTransactionOrder.js';
import { SwapBillsWithDustCollectorTransactionOrder } from '../transaction/order/types/SwapBillsWithDustCollectorTransactionOrder.js';
import { TransferBillToDustCollectorTransactionOrder } from '../transaction/order/types/TransferBillToDustCollectorTransactionOrder.js';
import { TransferBillTransactionOrder } from '../transaction/order/types/TransferBillTransactionOrder.js';
import { TransferFeeCreditTransactionOrder } from '../transaction/order/types/TransferFeeCreditTransactionOrder.js';
import { UnlockBillTransactionOrder } from '../transaction/order/types/UnlockBillTransactionOrder.js';
import { UnlockFeeCreditTransactionOrder } from '../transaction/order/types/UnlockFeeCreditTransactionOrder.js';
import { AddFeeCreditTransactionRecordWithProof } from '../transaction/record/AddFeeCreditTransactionRecordWithProof.js';
import { CloseFeeCreditTransactionRecordWithProof } from '../transaction/record/CloseFeeCreditTransactionRecordWithProof.js';
import { LockBillTransactionRecordWithProof } from '../transaction/record/LockBillTransactionRecordWithProof.js';
import { LockFeeCreditTransactionRecordWithProof } from '../transaction/record/LockFeeCreditTransactionRecordWithProof.js';
import { ReclaimFeeCreditTransactionRecordWithProof } from '../transaction/record/ReclaimFeeCreditTransactionRecordWithProof.js';
import { SplitBillTransactionRecordWithProof } from '../transaction/record/SplitBillTransactionRecordWithProof.js';
import { SwapBillsWithDustCollectorTransactionRecordWithProof } from '../transaction/record/SwapBillsWithDustCollectorTransactionRecordWithProof.js';
import { TransferBillToDustCollectorTransactionRecordWithProof } from '../transaction/record/TransferBillToDustCollectorTransactionRecordWithProof.js';
import { TransferBillTransactionRecordWithProof } from '../transaction/record/TransferBillTransactionRecordWithProof.js';
import { TransferFeeCreditTransactionRecordWithProof } from '../transaction/record/TransferFeeCreditTransactionRecordWithProof.js';
import { UnlockBillTransactionRecordWithProof } from '../transaction/record/UnlockBillTransactionRecordWithProof.js';
import { UnlockFeeCreditTransactionRecordWithProof } from '../transaction/record/UnlockFeeCreditTransactionRecordWithProof.js';
import { Bill } from '../unit/Bill.js';
import { FeeCreditRecord } from '../unit/FeeCreditRecord.js';
import { CreateTransactionRecordWithProof, CreateUnit, JsonRpcClient } from './JsonRpcClient.js';

type MoneyPartitionUnitTypes = Bill | FeeCreditRecord;

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
  public getUnitsByOwnerId(ownerId: Uint8Array): Promise<IUnitId[]> {
    return this.client.getUnitsByOwnerId(ownerId);
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
    factory: CreateUnit<T>,
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
