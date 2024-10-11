import { IUnit } from './IUnit.js';
import { IUnitId } from './IUnitId.js';
import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder } from './transaction/order/TransactionOrder.js';
import { TransactionRecordWithProof } from './transaction/record/TransactionRecordWithProof.js';

/**
 * State API service interface.
 * @interface IStateApiService
 */
export interface IStateApiService {
  /**
   * Get round number.
   * @returns {Promise<bigint>} The round number.
   */
  getRoundNumber(): Promise<bigint>;
  /**
   * Get Unit identifiers by owner ID.
   * @param {Uint8Array} ownerId Owner ID.
   * @returns {Promise<IUnitId[]>} Units identifiers.
   */
  getUnitsByOwnerId(ownerId: Uint8Array): Promise<IUnitId[]>;
  /**
   * Get unit by ID.
   * @param {IUnitId} unitId Unit ID.
   * @param {boolean} includeStateProof Include state proof.
   * @returns {Promise<T | null>} Unit.
   */
  getUnit<T extends IUnit>(unitId: IUnitId, includeStateProof: boolean): Promise<T | null>;
  /**
   * Get block.
   * @param {bigint} blockNumber Block number.
   * @returns {Promise<Uint8Array>} Block.
   */
  getBlock(blockNumber: bigint): Promise<Uint8Array>;
  /**
   * Get transaction proof.
   * @param {Uint8Array} transactionHash Transaction hash.
   * @returns {Promise<TransactionRecordWithProof<ITransactionPayloadAttributes> | null} Transaction proof.
   */
  getTransactionProof<Attributes extends ITransactionPayloadAttributes, Proof>(
    transactionHash: Uint8Array,
  ): Promise<TransactionRecordWithProof<Attributes, Proof> | null>;
  /**
   * Send transaction.
   * @param {TransactionOrder<ITransactionPayloadAttributes>} transaction Transaction.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  sendTransaction<Attributes extends ITransactionPayloadAttributes, Proof>(
    transaction: TransactionOrder<Attributes, Proof>,
  ): Promise<Uint8Array>;
}
