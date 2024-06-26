import { sha256 } from '@noble/hashes/sha256';
import { IStateApiService } from './IStateApiService.js';
import { IUnit } from './IUnit.js';
import { IUnitId } from './IUnitId.js';
import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder } from './transaction/TransactionOrder.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
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
   * @returns {Promise<TransactionRecordWithProof<TransactionPayload<ITransactionPayloadAttributes>> | null>} Transaction proof.
   */
  public getTransactionProof(
    transactionHash: Uint8Array,
  ): Promise<TransactionRecordWithProof<TransactionPayload<ITransactionPayloadAttributes>> | null> {
    return this.service.getTransactionProof(transactionHash);
  }

  /**
   * Send transaction.
   * @template {TransactionPayload<ITransactionPayloadAttributes>} T
   * @param {TransactionOrder} transaction Transaction.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public sendTransaction<T extends TransactionPayload<ITransactionPayloadAttributes>>(
    transaction: TransactionOrder<T>,
  ): Promise<Uint8Array> {
    return this.service.sendTransaction(transaction);
  }
}
