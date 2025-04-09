import { FeeCreditRecord } from '../fees/FeeCreditRecord.js';
import { AddFeeCredit, AddFeeCreditTransactionOrder } from '../fees/transactions/AddFeeCredit.js';
import { CloseFeeCredit, CloseFeeCreditTransactionOrder } from '../fees/transactions/CloseFeeCredit.js';
import { ReclaimFeeCredit, ReclaimFeeCreditTransactionOrder } from '../fees/transactions/ReclaimFeeCredit.js';
import { TransferFeeCredit, TransferFeeCreditTransactionOrder } from '../fees/transactions/TransferFeeCredit.js';
import { IUnitId } from '../IUnitId.js';
import { Bill } from '../money/Bill.js';
import { SplitBill, SplitBillTransactionOrder } from '../money/transactions/SplitBill.js';
import {
  SwapBillsWithDustCollector,
  SwapBillsWithDustCollectorTransactionOrder,
} from '../money/transactions/SwapBillsWithDustCollector.js';
import { TransferBill, TransferBillTransactionOrder } from '../money/transactions/TransferBill.js';
import {
  TransferBillToDustCollector,
  TransferBillToDustCollectorTransactionOrder,
} from '../money/transactions/TransferBillToDustCollector.js';
import { RootTrustBase } from '../RootTrustBase.js';
import { RoundInfo } from '../RoundInfo.js';
import { IBillDataDto } from './IBillDataDto.js';
import { IFeeCreditRecordDto } from './IFeeCreditRecordDto.js';
import { TransactionFactory, CreateUnit, JsonRpcClient } from './JsonRpcClient.js';
import { MoneyPartitionUnitIdResponse } from './MoneyPartitionUnitIdResponse.js';

type MoneyPartitionUnitTypes = Bill | FeeCreditRecord;

type UnitDto<T extends MoneyPartitionUnitTypes> = T extends Bill
  ? IBillDataDto
  : T extends FeeCreditRecord
    ? IFeeCreditRecordDto
    : never;

export type MoneyPartitionTransactionRecordWithProofTypes =
  | AddFeeCredit
  | CloseFeeCredit
  | ReclaimFeeCredit
  | SplitBill
  | SwapBillsWithDustCollector
  | TransferBillToDustCollector
  | TransferBill
  | TransferFeeCredit;

type MoneyPartitionTransactionOrderTypes =
  | AddFeeCreditTransactionOrder
  | CloseFeeCreditTransactionOrder
  | ReclaimFeeCreditTransactionOrder
  | SplitBillTransactionOrder
  | SwapBillsWithDustCollectorTransactionOrder
  | TransferBillToDustCollectorTransactionOrder
  | TransferBillTransactionOrder
  | TransferFeeCreditTransactionOrder;

/**
 * JSON-RPC money partition client.
 */
export class MoneyPartitionJsonRpcClient {
  public constructor(private readonly client: JsonRpcClient) {}

  /**
   * @see {JsonRpcClient.getRoundInfo}
   */
  public getRoundInfo(): Promise<RoundInfo> {
    return this.client.getRoundInfo();
  }

  /**
   * @see {JsonRpcClient.getUnitsByOwnerId}
   */
  public async getUnitsByOwnerId(ownerId: Uint8Array): Promise<MoneyPartitionUnitIdResponse> {
    return new MoneyPartitionUnitIdResponse(await this.client.getUnitsByOwnerId(ownerId));
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
    factory: TransactionFactory<TRP>,
  ): Promise<TRP | null> {
    return this.client.getTransactionProof(transactionHash, factory);
  }

  /**
   * @see {JsonRpcClient.waitTransactionProof}
   */
  public waitTransactionProof<TRP extends MoneyPartitionTransactionRecordWithProofTypes>(
    transactionHash: Uint8Array,
    factory: TransactionFactory<TRP>,
  ): Promise<TRP> {
    return this.client.waitTransactionProof(transactionHash, factory);
  }

  /**
   * @see {JsonRpcClient.sendTransaction}
   */
  public sendTransaction(transaction: MoneyPartitionTransactionOrderTypes): Promise<Uint8Array> {
    return this.client.sendTransaction(transaction);
  }

  /**
   * @see {JsonRpcClient.getTrustBase}
   */
  public getTrustBase(epochNumber: bigint): Promise<RootTrustBase> {
    return this.client.getTrustBase(epochNumber);
  }
}
