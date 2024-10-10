import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IStateProof } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { NonFungibleTokenType } from '../NonFungibleTokenType.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { IPredicate } from '../transaction/IPredicate.js';
import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../transaction/order/TransactionOrder.js';
import { ITransactionOrderProof } from '../transaction/proof/ITransactionOrderProof.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../TransactionRecordWithProof.js';
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
  public async getTransactionProof<
    TO extends TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof, ITransactionOrderProof>,
  >(
    transactionHash: Uint8Array,
    // TODO: Rename fromArray
    transactionRecordWithProofFactory: {
      fromArray: (
        transactionRecordWithProof: TransactionRecordWithProofArray,
        cborCodec: ICborCodec,
      ) => TransactionRecordWithProof<TO>;
    },
  ): Promise<TransactionRecordWithProof<TO> | null> {
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
  public async sendTransaction(
    transaction: TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof, ITransactionOrderProof>,
  ): Promise<Uint8Array> {
    const response = (await this.request(
      'state_sendTransaction',
      Base16Converter.encode(await this.cborCodec.encode(await transaction.encode(this.cborCodec))),
    )) as string;

    return Base16Converter.decode(response);
  }
}
