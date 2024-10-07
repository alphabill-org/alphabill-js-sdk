import { sha256 } from '@noble/hashes/sha256';
import { IStateApiService } from './IStateApiService.js';
import { IUnit } from './IUnit.js';
import { IUnitId } from './IUnitId.js';
import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder } from './transaction/order/TransactionOrder.js';
import { ITransactionOrderSerializer } from './transaction/serializer/ITransactionOrderSerializer';
import { TransactionOrderSerializer } from './transaction/serializer/TransactionOrderSerializer';
import { TransactionRecordWithProof } from './TransactionRecordWithProof.js';

/**
 * State API client.
 */
export class StateApiClient {
  /**
   * State API client constructor.
   * @param {IStateApiService} service State API service.
   */
  public constructor(private readonly service: IStateApiService) {}

  /**
   * Get round number.
   * @returns {Promise<bigint>} Round number.
   */
  public getRoundNumber(): Promise<bigint> {
    return this.service.getRoundNumber();
  }

  /**
   * Get Unit identifiers by owner ID.
   * @param {Uint8Array} ownerId Owner ID.
   * @returns {Promise<IUnitId[]>} Unit identifiers.
   */
  public getUnitsByOwnerId(ownerId: Uint8Array): Promise<IUnitId[]> {
    return this.service.getUnitsByOwnerId(sha256(ownerId));
  }

  /**
   * Get Unit.
   * @template T Unit data type.
   * @param {IUnitId} unitId Unit ID.
   * @param {boolean} includeStateProof Include state proof.
   * @returns {Promise<T | null>} Unit.
   */
  public getUnit<T extends IUnit>(unitId: IUnitId, includeStateProof: boolean): Promise<T | null> {
    return this.service.getUnit(unitId, includeStateProof);
  }

  /**
   * Get block.
   * @param {bigint} blockNumber Block number.
   * @returns {Promise<Uint8Array>} Block.
   */
  public getBlock(blockNumber: bigint): Promise<Uint8Array> {
    return this.service.getBlock(blockNumber);
  }

  /**
   * Get transaction proof.
   * @param {Uint8Array} transactionHash Transaction hash.
   * @param {TransactionOrderSerializer} serializer Transaction order serializer.
   * @returns {Promise<TransactionRecordWithProof | null>} Transaction proof.
   */
  public getTransactionProof<Attributes extends ITransactionPayloadAttributes, Proof>(
    transactionHash: Uint8Array,
  ): Promise<TransactionRecordWithProof<Attributes, Proof> | null> {
    return this.service.getTransactionProof<Attributes, Proof>(transactionHash);
  }

  /**
   * Send transaction.
   * @template {ITransactionPayloadAttributes} T
   * @param {TransactionOrder} transaction Transaction.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public sendTransaction<Attributes extends ITransactionPayloadAttributes, Proof>(
    transaction: TransactionOrder<Attributes, Proof>,
  ): Promise<Uint8Array> {
    return this.service.sendTransaction(transaction);
  }
}
