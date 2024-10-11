import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IStateProof } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { NonFungibleTokenType } from '../NonFungibleTokenType.js';
import { IPredicate } from '../transaction/IPredicate.js';
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
import { TransactionRecordWithProofArray } from '../TransactionRecordWithProof.js';
import { FeeCreditRecord } from '../unit/FeeCreditRecord.js';
import { FungibleToken } from '../unit/FungibleToken.js';
import { FungibleTokenType } from '../unit/FungibleTokenType.js';
import { NonFungibleToken } from '../unit/NonFungibleToken.js';
import { JsonRpcClient } from './JsonRpcClient.js';

type GetUnitTypes = {
  create: <T extends GetUnitTypes>(
    unitId: IUnitId,
    ownerPredicate: IPredicate,
    input: unknown,
    stateProof: IStateProof | null,
  ) => T;
} & (FungibleToken | NonFungibleToken | FeeCreditRecord | FungibleTokenType | NonFungibleTokenType);

type GetTransactionProofTypes = {
  fromArray: <T extends GetTransactionProofTypes>(
    transactionRecordWithProof: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ) => T;
} & (
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
  | UnlockTokenTransactionRecordWithProof
);

type SendTransactionTypes =
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
 * JSON-RPC client.
 */
export class TokenPartitionJsonRpcClient {
  public constructor(
    public readonly client: JsonRpcClient,
    public readonly cborCodec: ICborCodec,
  ) {}

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
  public getUnit<T extends GetUnitTypes>(
    unitId: IUnitId,
    includeStateProof: boolean,
    unitFactory: T,
  ): Promise<T | null> {
    return this.client.getUnit(unitId, includeStateProof, unitFactory);
  }

  /**
   * @see {JsonRpcClient.getTransactionProof}
   */
  public getTransactionProof<TRP extends GetTransactionProofTypes>(
    transactionHash: Uint8Array,
    transactionRecordWithProofFactory: TRP,
  ): Promise<TRP | null> {
    return this.client.getTransactionProof(transactionHash, transactionRecordWithProofFactory);
  }

  /**
   * @see {JsonRpcClient.sendTransaction}
   */
  public sendTransaction(transaction: SendTransactionTypes): Promise<Uint8Array> {
    return this.client.sendTransaction(transaction);
  }
}
