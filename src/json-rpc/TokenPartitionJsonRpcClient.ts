import { FeeCreditRecord } from '../fees/FeeCreditRecord.js';
import { AddFeeCredit, AddFeeCreditTransactionOrder } from '../fees/transactions/AddFeeCredit.js';
import { CloseFeeCredit, CloseFeeCreditTransactionOrder } from '../fees/transactions/CloseFeeCredit.js';
import { DeleteFeeCredit, DeleteFeeCreditTransactionOrder } from '../fees/transactions/DeleteFeeCredit.js';
import { LockFeeCredit, LockFeeCreditTransactionOrder } from '../fees/transactions/LockFeeCredit.js';
import { SetFeeCredit, SetFeeCreditTransactionOrder } from '../fees/transactions/SetFeeCredit.js';
import { UnlockFeeCredit, UnlockFeeCreditTransactionOrder } from '../fees/transactions/UnlockFeeCredit.js';
import { IUnitId } from '../IUnitId.js';
import { RootTrustBase } from '../RootTrustBase.js';
import { FungibleToken } from '../tokens/FungibleToken.js';
import { FungibleTokenType } from '../tokens/FungibleTokenType.js';
import { NonFungibleToken } from '../tokens/NonFungibleToken.js';
import { NonFungibleTokenType } from '../tokens/NonFungibleTokenType.js';
import { BurnFungibleToken, BurnFungibleTokenTransactionOrder } from '../tokens/transactions/BurnFungibleToken.js';
import {
  CreateFungibleToken,
  CreateFungibleTokenTransactionOrder,
} from '../tokens/transactions/CreateFungibleToken.js';
import {
  CreateFungibleTokenType,
  CreateFungibleTokenTypeTransactionOrder,
} from '../tokens/transactions/CreateFungibleTokenType.js';
import {
  CreateNonFungibleToken,
  CreateNonFungibleTokenTransactionOrder,
} from '../tokens/transactions/CreateNonFungibleToken.js';
import {
  CreateNonFungibleTokenType,
  CreateNonFungibleTokenTypeTransactionOrder,
} from '../tokens/transactions/CreateNonFungibleTokenType.js';
import { JoinFungibleToken, JoinFungibleTokenTransactionOrder } from '../tokens/transactions/JoinFungibleToken.js';
import { LockToken, LockTokenTransactionOrder } from '../tokens/transactions/LockToken.js';
import { SplitFungibleToken, SplitFungibleTokenTransactionOrder } from '../tokens/transactions/SplitFungibleToken.js';
import {
  TransferFungibleToken,
  TransferFungibleTokenTransactionOrder,
} from '../tokens/transactions/TransferFungibleToken.js';
import {
  TransferNonFungibleToken,
  TransferNonFungibleTokenTransactionOrder,
} from '../tokens/transactions/TransferNonFungibleToken.js';
import { UnlockToken, UnlockTokenTransactionOrder } from '../tokens/transactions/UnlockToken.js';
import {
  UpdateNonFungibleToken,
  UpdateNonFungibleTokenTransactionOrder,
} from '../tokens/transactions/UpdateNonFungibleToken.js';
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
  | AddFeeCredit
  | BurnFungibleToken
  | CloseFeeCredit
  | CreateFungibleToken
  | CreateFungibleTokenType
  | CreateNonFungibleToken
  | CreateNonFungibleTokenType
  | DeleteFeeCredit
  | JoinFungibleToken
  | LockFeeCredit
  | LockToken
  | SetFeeCredit
  | SplitFungibleToken
  | TransferFungibleToken
  | TransferNonFungibleToken
  | UnlockFeeCredit
  | UnlockToken
  | UpdateNonFungibleToken;

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
