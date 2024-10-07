import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../order/TransactionOrder.js';
import { TransactionOrderArray } from '../order/TransactionOrderArray';

export interface ITransactionOrderSerializer<T extends TransactionOrder<ITransactionPayloadAttributes>> {
  serialize(data: T): Promise<Uint8Array>;

  deserialize(data: Uint8Array): Promise<T>;

  fromArray(data: TransactionOrderArray): Promise<T>;
}