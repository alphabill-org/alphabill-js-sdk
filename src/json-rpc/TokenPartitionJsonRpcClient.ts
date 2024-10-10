import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IStateProof } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { NonFungibleTokenType } from '../NonFungibleTokenType.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { IPredicate } from '../transaction/IPredicate.js';
import { AddFeeCreditTransactionOrder } from '../transaction/order/AddFeeCreditTransactionOrder.js';
import { BurnFungibleTokenTransactionOrder } from '../transaction/order/BurnFungibleTokenTransactionOrder.js';
import { CloseFeeCreditTransactionOrder } from '../transaction/order/CloseFeeCreditTransactionOrder.js';
import { CreateFungibleTokenTransactionOrder } from '../transaction/order/CreateFungibleTokenTransactionOrder.js';
import { CreateFungibleTokenTypeTransactionOrder } from '../transaction/order/CreateFungibleTokenTypeTransactionOrder.js';
import { CreateNonFungibleTokenTransactionOrder } from '../transaction/order/CreateNonFungibleTokenTransactionOrder.js';
import { CreateNonFungibleTokenTypeTransactionOrder } from '../transaction/order/CreateNonFungibleTokenTypeTransactionOrder.js';
import { JoinFungibleTokenTransactionOrder } from '../transaction/order/JoinFungibleTokenTransactionOrder.js';
import { LockFeeCreditTransactionOrder } from '../transaction/order/LockFeeCreditTransactionOrder.js';
import { LockTokenTransactionOrder } from '../transaction/order/LockTokenTransactionOrder.js';
import { SplitFungibleTokenTransactionOrder } from '../transaction/order/SplitFungibleTokenTransactionOrder.js';
import { TransferFungibleTokenTransactionOrder } from '../transaction/order/TransferFungibleTokenTransactionOrder.js';
import { TransferNonFungibleTokenTransactionOrder } from '../transaction/order/TransferNonFungibleTokenTransactionOrder.js';
import { UnlockFeeCreditTransactionOrder } from '../transaction/order/UnlockFeeCreditTransactionOrder.js';
import { UnlockTokenTransactionOrder } from '../transaction/order/UnlockTokenTransactionOrder.js';
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
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IJsonRpcService } from './IJsonRpcService.js';
import { IUnitDto } from './IUnitDto.js';
import { JsonRpcClient } from './JsonRpcClient.js';
import { createStateProof } from './StateProofFactory.js';
import { TransactionProofDto } from './TransactionProofDto.js';

type GetUnitTypes = FungibleToken | NonFungibleToken | FeeCreditRecord | FungibleTokenType | NonFungibleTokenType;
type GetTransactionProofTypes =
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
export class TokenPartitionJsonRpcClient extends JsonRpcClient {
  public constructor(service: IJsonRpcService, cborCodec: ICborCodec) {
    super(service, cborCodec);
  }

  /**
   * @see {IStateApiService.getUnit}
   */
  public async getUnit<T extends GetUnitTypes>(
    unitId: IUnitId,
    includeStateProof: boolean,
    unitFactory: {
      create: (unitId: IUnitId, ownerPredicate: IPredicate, input: unknown, stateProof: IStateProof | null) => T;
    },
  ): Promise<T | null> {
    const response = await this.request<IUnitDto>(
      'state_getUnit',
      Base16Converter.encode(unitId.bytes),
      includeStateProof,
    );

    if (response) {
      const unitId = UnitId.fromBytes(Base16Converter.decode(response.unitId));

      return unitFactory.create(
        unitId,
        new PredicateBytes(Base16Converter.decode(response.ownerPredicate)),
        response.data,
        response.stateProof ? createStateProof(response.stateProof) : null,
      );
    }

    return null;
  }

  /**
   * @see {IStateApiService.getTransactionProof}
   */
  public async getTransactionProof<TRP extends GetTransactionProofTypes>(
    transactionHash: Uint8Array,
    // TODO: Rename fromArray
    transactionRecordWithProofFactory: {
      fromArray: (transactionRecordWithProof: TransactionRecordWithProofArray, cborCodec: ICborCodec) => TRP;
    },
  ): Promise<TRP | null> {
    const response = (await this.request(
      'state_getTransactionProof',
      Base16Converter.encode(transactionHash),
    )) as TransactionProofDto | null;

    if (!response) {
      return null;
    }

    const transactionRecordWithProof = (await this.cborCodec.decode(
      Base16Converter.decode(response.txRecordProof),
    )) as TransactionRecordWithProofArray;
    return transactionRecordWithProofFactory.fromArray(transactionRecordWithProof, this.cborCodec);
  }

  /**
   * @see {IStateApiService.sendTransaction}
   */
  public async sendTransaction(transaction: SendTransactionTypes): Promise<Uint8Array> {
    const response = (await this.request(
      'state_sendTransaction',
      Base16Converter.encode(await this.cborCodec.encode(await transaction.encode(this.cborCodec))),
    )) as string;

    return Base16Converter.decode(response);
  }
}
