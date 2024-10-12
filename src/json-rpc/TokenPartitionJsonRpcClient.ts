import { IUnitId } from '../IUnitId.js';
import { AddFeeCreditTransactionOrder } from '../transaction/order/types/AddFeeCreditTransactionOrder.js';
import { BurnFungibleTokenTransactionOrder } from '../transaction/order/types/BurnFungibleTokenTransactionOrder.js';
import { CloseFeeCreditTransactionOrder } from '../transaction/order/types/CloseFeeCreditTransactionOrder.js';
import { CreateFungibleTokenTransactionOrder } from '../transaction/order/types/CreateFungibleTokenTransactionOrder.js';
import { CreateFungibleTokenTypeTransactionOrder } from '../transaction/order/types/CreateFungibleTokenTypeTransactionOrder.js';
import { CreateNonFungibleTokenTransactionOrder } from '../transaction/order/types/CreateNonFungibleTokenTransactionOrder.js';
import { CreateNonFungibleTokenTypeTransactionOrder } from '../transaction/order/types/CreateNonFungibleTokenTypeTransactionOrder.js';
import { JoinFungibleTokenTransactionOrder } from '../transaction/order/types/JoinFungibleTokenTransactionOrder.js';
import { LockFeeCreditTransactionOrder } from '../transaction/order/types/LockFeeCreditTransactionOrder.js';
import { LockTokenTransactionOrder } from '../transaction/order/types/LockTokenTransactionOrder.js';
import { SplitFungibleTokenTransactionOrder } from '../transaction/order/types/SplitFungibleTokenTransactionOrder.js';
import { TransferFungibleTokenTransactionOrder } from '../transaction/order/types/TransferFungibleTokenTransactionOrder.js';
import { TransferNonFungibleTokenTransactionOrder } from '../transaction/order/types/TransferNonFungibleTokenTransactionOrder.js';
import { UnlockFeeCreditTransactionOrder } from '../transaction/order/types/UnlockFeeCreditTransactionOrder.js';
import { UnlockTokenTransactionOrder } from '../transaction/order/types/UnlockTokenTransactionOrder.js';
import { AddFeeCreditTransactionRecordWithProof } from '../transaction/record/AddFeeCreditTransactionRecordWithProof.js';
import { BurnFungibleTokenTransactionRecordWithProof } from '../transaction/record/BurnFungibleTokenTransactionRecordWithProof.js';
import { CloseFeeCreditTransactionRecordWithProof } from '../transaction/record/CloseFeeCreditTransactionRecordWithProof.js';
import { CreateFungibleTokenTransactionRecordWithProof } from '../transaction/record/CreateFungibleTokenTransactionRecordWithProof.js';
import { CreateFungibleTokenTypeTransactionRecordWithProof } from '../transaction/record/CreateFungibleTokenTypeTransactionRecordWithProof.js';
import { CreateNonFungibleTokenTransactionRecordWithProof } from '../transaction/record/CreateNonFungibleTokenTransactionRecordWithProof.js';
import { CreateNonFungibleTokenTypeTransactionRecordWithProof } from '../transaction/record/CreateNonFungibleTokenTypeTransactionRecordWithProof.js';
import { JoinFungibleTokenTransactionRecordWithProof } from '../transaction/record/JoinFungibleTokenTransactionRecordWithProof.js';
import { LockFeeCreditTransactionRecordWithProof } from '../transaction/record/LockFeeCreditTransactionRecordWithProof.js';
import { LockTokenTransactionRecordWithProof } from '../transaction/record/LockTokenTransactionRecordWithProof.js';
import { SplitFungibleTokenTransactionRecordWithProof } from '../transaction/record/SplitFungibleTokenTransactionRecordWithProof.js';
import { TransferFungibleTokenTransactionRecordWithProof } from '../transaction/record/TransferFungibleTokenTransactionRecordWithProof.js';
import { TransferNonFungibleTokenTransactionRecordWithProof } from '../transaction/record/TransferNonFungibleTokenTransactionRecordWithProof.js';
import { UnlockFeeCreditTransactionRecordWithProof } from '../transaction/record/UnlockFeeCreditTransactionRecordWithProof.js';
import { UnlockTokenTransactionRecordWithProof } from '../transaction/record/UnlockTokenTransactionRecordWithProof.js';
import { FeeCreditRecord } from '../unit/FeeCreditRecord.js';
import { FungibleToken } from '../unit/FungibleToken.js';
import { FungibleTokenType } from '../unit/FungibleTokenType.js';
import { NonFungibleToken } from '../unit/NonFungibleToken.js';
import { NonFungibleTokenType } from '../unit/NonFungibleTokenType.js';
import { CreateTransactionRecordWithProof, CreateUnit, JsonRpcClient } from './JsonRpcClient.js';

type TokenPartitionUnitTypes =
  | FungibleToken
  | NonFungibleToken
  | FeeCreditRecord
  | FungibleTokenType
  | NonFungibleTokenType;

export type TokenPartitionTransactionRecordWithProofTypes =
  | AddFeeCreditTransactionRecordWithProof
  | BurnFungibleTokenTransactionRecordWithProof
  | CloseFeeCreditTransactionRecordWithProof
  | CreateFungibleTokenTransactionRecordWithProof
  | CreateFungibleTokenTypeTransactionRecordWithProof
  | CreateNonFungibleTokenTransactionRecordWithProof
  | CreateNonFungibleTokenTypeTransactionRecordWithProof
  | JoinFungibleTokenTransactionRecordWithProof
  | LockFeeCreditTransactionRecordWithProof
  | LockTokenTransactionRecordWithProof
  | SplitFungibleTokenTransactionRecordWithProof
  | TransferFungibleTokenTransactionRecordWithProof
  | TransferNonFungibleTokenTransactionRecordWithProof
  | UnlockFeeCreditTransactionRecordWithProof
  | UnlockTokenTransactionRecordWithProof;

type TokenPartitionTransactionOrderTypes =
  | AddFeeCreditTransactionOrder
  | BurnFungibleTokenTransactionOrder
  | CloseFeeCreditTransactionOrder
  | CreateFungibleTokenTransactionOrder
  | CreateFungibleTokenTypeTransactionOrder
  | CreateNonFungibleTokenTransactionOrder
  | CreateNonFungibleTokenTypeTransactionOrder
  | JoinFungibleTokenTransactionOrder
  | LockFeeCreditTransactionOrder
  | LockTokenTransactionOrder
  | SplitFungibleTokenTransactionOrder
  | TransferFungibleTokenTransactionOrder
  | TransferNonFungibleTokenTransactionOrder
  | UnlockFeeCreditTransactionOrder
  | UnlockTokenTransactionOrder;

/**
 * JSON-RPC token partition client.
 */
export class TokenPartitionJsonRpcClient {
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
  public getUnit<T extends TokenPartitionUnitTypes>(
    unitId: IUnitId,
    includeStateProof: boolean,
    factory: CreateUnit<T>,
  ): Promise<T | null> {
    return this.client.getUnit(unitId, includeStateProof, factory);
  }

  /**
   * @see {JsonRpcClient.getTransactionProof}
   */
  public getTransactionProof<TRP extends TokenPartitionTransactionRecordWithProofTypes>(
    transactionHash: Uint8Array,
    factory: CreateTransactionRecordWithProof<TRP>,
  ): Promise<TRP | null> {
    return this.client.getTransactionProof(transactionHash, factory);
  }

  /**
   * @see {JsonRpcClient.waitTransactionProof}
   */
  public waitTransactionProof<TRP extends TokenPartitionTransactionRecordWithProofTypes>(
    transactionHash: Uint8Array,
    factory: CreateTransactionRecordWithProof<TRP>,
  ): Promise<TRP> {
    return this.client.waitTransactionProof(transactionHash, factory);
  }

  /**
   * @see {JsonRpcClient.sendTransaction}
   */
  public sendTransaction(transaction: TokenPartitionTransactionOrderTypes): Promise<Uint8Array> {
    return this.client.sendTransaction(transaction);
  }
}
