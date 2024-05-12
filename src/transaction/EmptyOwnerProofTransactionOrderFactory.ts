import { ITransactionOrderFactory } from './ITransactionOrderFactory.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransactionOrder } from './TransactionOrder.js';
import { TransactionPayload } from './TransactionPayload.js';

export class EmptyOwnerProofTransactionOrderFactory implements ITransactionOrderFactory {
  /**
   * Create transaction order.
   * @param {T} payload - Transaction payload.
   * @returns {Promise<TransactionOrder<T>>} Transaction order.
   */
  public createTransaction<T extends TransactionPayload<ITransactionPayloadAttributes>>(
    payload: T,
  ): Promise<TransactionOrder<T>> {
    return Promise.resolve(new TransactionOrder(payload, null, null));
  }
}
