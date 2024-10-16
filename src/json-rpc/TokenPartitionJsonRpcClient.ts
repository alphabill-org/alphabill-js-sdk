import { FeeCreditRecord } from '../fees/FeeCreditRecord.js';
import { AddFeeCreditTransactionOrder } from '../fees/transactions/AddFeeCreditTransactionOrder.js';
import { CloseFeeCreditTransactionOrder } from '../fees/transactions/CloseFeeCreditTransactionOrder.js';
import { DeleteFeeCreditTransactionOrder } from '../fees/transactions/DeleteFeeCreditTransactionOrder.js';
import { LockFeeCreditTransactionOrder } from '../fees/transactions/LockFeeCreditTransactionOrder.js';
import { AddFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/AddFeeCreditTransactionRecordWithProof.js';
import { CloseFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/CloseFeeCreditTransactionRecordWithProof.js';
import { DeleteFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/DeleteFeeCreditTransactionRecordWithProof.js';
import { LockFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/LockFeeCreditTransactionRecordWithProof.js';
import { SetFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/SetFeeCreditTransactionRecordWithProof.js';
import { UnlockFeeCreditTransactionRecordWithProof } from '../fees/transactions/records/UnlockFeeCreditTransactionRecordWithProof.js';
import { SetFeeCreditTransactionOrder } from '../fees/transactions/SetFeeCreditTransactionOrder.js';
import { UnlockFeeCreditTransactionOrder } from '../fees/transactions/UnlockFeeCreditTransactionOrder.js';
import { IUnitId } from '../IUnitId.js';
import { FungibleToken } from '../tokens/FungibleToken.js';
import { FungibleTokenType } from '../tokens/FungibleTokenType.js';
import { NonFungibleToken } from '../tokens/NonFungibleToken.js';
import { NonFungibleTokenType } from '../tokens/NonFungibleTokenType.js';
import { BurnFungibleTokenTransactionOrder } from '../tokens/transactions/BurnFungibleTokenTransactionOrder.js';
import { BurnFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/BurnFungibleTokenTransactionRecordWithProof.js';
import { CreateFungibleTokenTransactionOrder } from '../tokens/transactions/CreateFungibleTokenTransactionOrder.js';
import { CreateFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/CreateFungibleTokenTransactionRecordWithProof.js';
import { CreateFungibleTokenTypeTransactionOrder } from '../tokens/transactions/CreateFungibleTokenTypeTransactionOrder.js';
import { CreateFungibleTokenTypeTransactionRecordWithProof } from '../tokens/transactions/CreateFungibleTokenTypeTransactionRecordWithProof.js';
import { CreateNonFungibleTokenTransactionOrder } from '../tokens/transactions/CreateNonFungibleTokenTransactionOrder.js';
import { CreateNonFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/CreateNonFungibleTokenTransactionRecordWithProof.js';
import { CreateNonFungibleTokenTypeTransactionOrder } from '../tokens/transactions/CreateNonFungibleTokenTypeTransactionOrder.js';
import { CreateNonFungibleTokenTypeTransactionRecordWithProof } from '../tokens/transactions/CreateNonFungibleTokenTypeTransactionRecordWithProof.js';
import { JoinFungibleTokenTransactionOrder } from '../tokens/transactions/JoinFungibleTokenTransactionOrder.js';
import { JoinFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/JoinFungibleTokenTransactionRecordWithProof.js';
import { LockTokenTransactionOrder } from '../tokens/transactions/LockTokenTransactionOrder.js';
import { LockTokenTransactionRecordWithProof } from '../tokens/transactions/LockTokenTransactionRecordWithProof.js';
import { SplitFungibleTokenTransactionOrder } from '../tokens/transactions/SplitFungibleTokenTransactionOrder.js';
import { SplitFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/SplitFungibleTokenTransactionRecordWithProof.js';
import { TransferFungibleTokenTransactionOrder } from '../tokens/transactions/TransferFungibleTokenTransactionOrder.js';
import { TransferFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/TransferFungibleTokenTransactionRecordWithProof.js';
import { TransferNonFungibleTokenTransactionOrder } from '../tokens/transactions/TransferNonFungibleTokenTransactionOrder.js';
import { TransferNonFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/TransferNonFungibleTokenTransactionRecordWithProof.js';
import { UnlockTokenTransactionOrder } from '../tokens/transactions/UnlockTokenTransactionOrder.js';
import { UnlockTokenTransactionRecordWithProof } from '../tokens/transactions/UnlockTokenTransactionRecordWithProof.js';
import { UpdateNonFungibleTokenTransactionOrder } from '../tokens/transactions/UpdateNonFungibleTokenTransactionOrder.js';
import { UpdateNonFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/UpdateNonFungibleTokenTransactionRecordWithProof.js';
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
  | DeleteFeeCreditTransactionRecordWithProof
  | JoinFungibleTokenTransactionRecordWithProof
  | LockFeeCreditTransactionRecordWithProof
  | LockTokenTransactionRecordWithProof
  | SetFeeCreditTransactionRecordWithProof
  | SplitFungibleTokenTransactionRecordWithProof
  | TransferFungibleTokenTransactionRecordWithProof
  | TransferNonFungibleTokenTransactionRecordWithProof
  | UnlockFeeCreditTransactionRecordWithProof
  | UnlockTokenTransactionRecordWithProof
  | UpdateNonFungibleTokenTransactionRecordWithProof;

type TokenPartitionTransactionOrderTypes =
  | AddFeeCreditTransactionOrder
  | BurnFungibleTokenTransactionOrder
  | CloseFeeCreditTransactionOrder
  | CreateFungibleTokenTransactionOrder
  | CreateFungibleTokenTypeTransactionOrder
  | CreateNonFungibleTokenTransactionOrder
  | CreateNonFungibleTokenTypeTransactionOrder
  | DeleteFeeCreditTransactionOrder
  | JoinFungibleTokenTransactionOrder
  | LockFeeCreditTransactionOrder
  | LockTokenTransactionOrder
  | SetFeeCreditTransactionOrder
  | SplitFungibleTokenTransactionOrder
  | TransferFungibleTokenTransactionOrder
  | TransferNonFungibleTokenTransactionOrder
  | UnlockFeeCreditTransactionOrder
  | UnlockTokenTransactionOrder
  | UpdateNonFungibleTokenTransactionOrder;

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
