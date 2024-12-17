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
import { RootTrustBase } from '../RootTrustBase.js';
import { FungibleToken } from '../tokens/FungibleToken.js';
import { FungibleTokenType } from '../tokens/FungibleTokenType.js';
import { NonFungibleToken } from '../tokens/NonFungibleToken.js';
import { NonFungibleTokenType } from '../tokens/NonFungibleTokenType.js';
import { BurnFungibleTokenTransactionOrder } from '../tokens/transactions/BurnFungibleTokenTransactionOrder.js';
import { CreateFungibleTokenTransactionOrder } from '../tokens/transactions/CreateFungibleTokenTransactionOrder.js';
import { CreateFungibleTokenTypeTransactionOrder } from '../tokens/transactions/CreateFungibleTokenTypeTransactionOrder.js';
import { CreateNonFungibleTokenTransactionOrder } from '../tokens/transactions/CreateNonFungibleTokenTransactionOrder.js';
import { CreateNonFungibleTokenTypeTransactionOrder } from '../tokens/transactions/CreateNonFungibleTokenTypeTransactionOrder.js';
import { JoinFungibleTokenTransactionOrder } from '../tokens/transactions/JoinFungibleTokenTransactionOrder.js';
import { LockTokenTransactionOrder } from '../tokens/transactions/LockTokenTransactionOrder.js';
import { BurnFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/records/BurnFungibleTokenTransactionRecordWithProof.js';
import { CreateFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/records/CreateFungibleTokenTransactionRecordWithProof.js';
import { CreateFungibleTokenTypeTransactionRecordWithProof } from '../tokens/transactions/records/CreateFungibleTokenTypeTransactionRecordWithProof.js';
import { CreateNonFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/records/CreateNonFungibleTokenTransactionRecordWithProof.js';
import { CreateNonFungibleTokenTypeTransactionRecordWithProof } from '../tokens/transactions/records/CreateNonFungibleTokenTypeTransactionRecordWithProof.js';
import { JoinFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/records/JoinFungibleTokenTransactionRecordWithProof.js';
import { LockTokenTransactionRecordWithProof } from '../tokens/transactions/records/LockTokenTransactionRecordWithProof.js';
import { SplitFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/records/SplitFungibleTokenTransactionRecordWithProof.js';
import { TransferFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/records/TransferFungibleTokenTransactionRecordWithProof.js';
import { TransferNonFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/records/TransferNonFungibleTokenTransactionRecordWithProof.js';
import { UnlockTokenTransactionRecordWithProof } from '../tokens/transactions/records/UnlockTokenTransactionRecordWithProof.js';
import { UpdateNonFungibleTokenTransactionRecordWithProof } from '../tokens/transactions/records/UpdateNonFungibleTokenTransactionRecordWithProof.js';
import { SplitFungibleTokenTransactionOrder } from '../tokens/transactions/SplitFungibleTokenTransactionOrder.js';
import { TransferFungibleTokenTransactionOrder } from '../tokens/transactions/TransferFungibleTokenTransactionOrder.js';
import { TransferNonFungibleTokenTransactionOrder } from '../tokens/transactions/TransferNonFungibleTokenTransactionOrder.js';
import { UnlockTokenTransactionOrder } from '../tokens/transactions/UnlockTokenTransactionOrder.js';
import { UpdateNonFungibleTokenTransactionOrder } from '../tokens/transactions/UpdateNonFungibleTokenTransactionOrder.js';
import { IFeeCreditRecordDto } from './IFeeCreditRecordDto.js';
import { IFungibleTokenDto } from './IFungibleTokenDto.js';
import { IFungibleTokenTypeDto } from './IFungibleTokenTypeDto.js';
import { INonFungibleTokenDto } from './INonFungibleTokenDto.js';
import { INonFungibleTokenTypeDto } from './INonFungibleTokenTypeDto.js';
import { CreateTransactionRecordWithProof, CreateUnit, JsonRpcClient } from './JsonRpcClient.js';
import { TokenPartitionUnitIdResponse } from './TokenPartitionUnitIdResponse.js';

type TokenPartitionUnitTypes =
  | FungibleToken
  | NonFungibleToken
  | FeeCreditRecord
  | FungibleTokenType
  | NonFungibleTokenType;

type UnitDto<T extends TokenPartitionUnitTypes> = T extends FungibleToken
  ? IFungibleTokenDto
  : T extends NonFungibleToken
    ? INonFungibleTokenDto
    : T extends FeeCreditRecord
      ? IFeeCreditRecordDto
      : T extends FungibleTokenType
        ? IFungibleTokenTypeDto
        : T extends NonFungibleTokenType
          ? INonFungibleTokenTypeDto
          : never;

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
  public async getUnitsByOwnerId(ownerId: Uint8Array): Promise<TokenPartitionUnitIdResponse> {
    return new TokenPartitionUnitIdResponse(await this.client.getUnitsByOwnerId(ownerId));
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
    factory: CreateUnit<T, UnitDto<T>>,
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

  /**
   * @see {JsonRpcClient.getTrustBase}
   */
  public getTrustBase(epochNumber: bigint): Promise<RootTrustBase> {
    return this.client.getTrustBase(epochNumber);
  }
}
