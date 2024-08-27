import { AddFeeCreditAttributes } from './attribute/AddFeeCreditAttributes.js';
import { BurnFungibleTokenAttributes } from './attribute/BurnFungibleTokenAttributes.js';
import { CloseFeeCreditAttributes } from './attribute/CloseFeeCreditAttributes.js';
import { CreateFungibleTokenAttributes } from './attribute/CreateFungibleTokenAttributes.js';
import { CreateFungibleTokenTypeAttributes } from './attribute/CreateFungibleTokenTypeAttributes.js';
import { CreateNonFungibleTokenAttributes } from './attribute/CreateNonFungibleTokenAttributes.js';
import { CreateNonFungibleTokenTypeAttributes } from './attribute/CreateNonFungibleTokenTypeAttributes.js';
import { JoinFungibleTokenAttributes } from './attribute/JoinFungibleTokenAttributes.js';
import { LockBillAttributes } from './attribute/LockBillAttributes.js';
import { LockFeeCreditAttributes } from './attribute/LockFeeCreditAttributes.js';
import { LockTokenAttributes } from './attribute/LockTokenAttributes.js';
import { ReclaimFeeCreditAttributes } from './attribute/ReclaimFeeCreditAttributes.js';
import { SplitBillAttributes } from './attribute/SplitBillAttributes.js';
import { SplitFungibleTokenAttributes } from './attribute/SplitFungibleTokenAttributes.js';
import { SwapBillsWithDustCollectorAttributes } from './attribute/SwapBillsWithDustCollectorAttributes.js';
import { TransferBillAttributes } from './attribute/TransferBillAttributes.js';
import { TransferBillToDustCollectorAttributes } from './attribute/TransferBillToDustCollectorAttributes.js';
import { TransferFeeCreditAttributes } from './attribute/TransferFeeCreditAttributes.js';
import { TransferFungibleTokenAttributes } from './attribute/TransferFungibleTokenAttributes.js';
import { TransferNonFungibleTokenAttributes } from './attribute/TransferNonFungibleTokenAttributes.js';
import { UnlockBillAttributes } from './attribute/UnlockBillAttributes.js';
import { UnlockFeeCreditAttributes } from './attribute/UnlockFeeCreditAttributes.js';
import { UnlockTokenAttributes } from './attribute/UnlockTokenAttributes.js';
import { UpdateNonFungibleTokenAttributes } from './attribute/UpdateNonFungibleTokenAttributes.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

/**
 * Payload type.
 */
export enum PayloadType {
  AddFeeCreditAttributes = 'addFC',
  BurnFungibleTokenAttributes = 'burnFToken',
  CloseFeeCreditAttributes = 'closeFC',
  CreateFungibleTokenAttributes = 'createFToken',
  CreateFungibleTokenTypeAttributes = 'createFType',
  CreateNonFungibleTokenAttributes = 'createNToken',
  CreateNonFungibleTokenTypeAttributes = 'createNType',
  JoinFungibleTokenAttributes = 'joinFToken',
  LockTokenAttributes = 'lockToken',
  LockBillAttributes = 'lock',
  LockFeeCreditAttributes = 'lockFC',
  ReclaimFeeCreditAttributes = 'reclFC',
  SplitBillAttributes = 'split',
  SplitFungibleTokenAttributes = 'splitFToken',
  SwapBillsWithDustCollectorAttributes = 'swapDC',
  TransferBillAttributes = 'trans',
  TransferBillToDustCollectorAttributes = 'transDC',
  TransferFeeCreditAttributes = 'transFC',
  TransferFungibleTokenAttributes = 'transFToken',
  TransferNonFungibleTokenAttributes = 'transNToken',
  UnlockBillAttributes = 'unlock',
  UnlockTokenAttributes = 'unlockToken',
  UnlockFeeCreditAttributes = 'unlockFC',
  UpdateNonFungibleTokenAttributes = 'updateNToken',
}

const payloadAttributesMap = new Map<PayloadType, (data: unknown) => ITransactionPayloadAttributes>([
  [PayloadType.AddFeeCreditAttributes, AddFeeCreditAttributes.fromArray],
  [PayloadType.BurnFungibleTokenAttributes, BurnFungibleTokenAttributes.fromArray],
  [PayloadType.CloseFeeCreditAttributes, CloseFeeCreditAttributes.fromArray],
  [PayloadType.CreateFungibleTokenAttributes, CreateFungibleTokenAttributes.fromArray],
  [PayloadType.CreateFungibleTokenTypeAttributes, CreateFungibleTokenTypeAttributes.fromArray],
  [PayloadType.CreateNonFungibleTokenAttributes, CreateNonFungibleTokenAttributes.fromArray],
  [PayloadType.CreateNonFungibleTokenTypeAttributes, CreateNonFungibleTokenTypeAttributes.fromArray],
  [PayloadType.JoinFungibleTokenAttributes, JoinFungibleTokenAttributes.fromArray],
  [PayloadType.LockBillAttributes, LockBillAttributes.fromArray],
  [PayloadType.LockTokenAttributes, LockTokenAttributes.fromArray],
  [PayloadType.LockFeeCreditAttributes, LockFeeCreditAttributes.fromArray],
  [PayloadType.ReclaimFeeCreditAttributes, ReclaimFeeCreditAttributes.fromArray],
  [PayloadType.SplitBillAttributes, SplitBillAttributes.fromArray],
  [PayloadType.SplitFungibleTokenAttributes, SplitFungibleTokenAttributes.fromArray],
  [PayloadType.SwapBillsWithDustCollectorAttributes, SwapBillsWithDustCollectorAttributes.fromArray],
  [PayloadType.TransferBillAttributes, TransferBillAttributes.fromArray],
  [PayloadType.TransferBillToDustCollectorAttributes, TransferBillToDustCollectorAttributes.fromArray],
  [PayloadType.TransferFeeCreditAttributes, TransferFeeCreditAttributes.fromArray],
  [PayloadType.TransferFungibleTokenAttributes, TransferFungibleTokenAttributes.fromArray],
  [PayloadType.TransferNonFungibleTokenAttributes, TransferNonFungibleTokenAttributes.fromArray],
  [PayloadType.UnlockBillAttributes, UnlockBillAttributes.fromArray],
  [PayloadType.UnlockTokenAttributes, UnlockTokenAttributes.fromArray],
  [PayloadType.UnlockFeeCreditAttributes, UnlockFeeCreditAttributes.fromArray],
  [PayloadType.UpdateNonFungibleTokenAttributes, UpdateNonFungibleTokenAttributes.fromArray],
]);

/**
 * Create transaction payload attributes from payload type and data array.
 * @param {PayloadType} type - Payload type.
 * @param {unknown} data - Payload data.
 * @returns {ITransactionPayloadAttributes} Transaction payload attributes.
 */
export function createAttribute(type: PayloadType, data: unknown): ITransactionPayloadAttributes {
  const payloadAttribute = payloadAttributesMap.get(type);
  if (payloadAttribute === undefined) {
    throw new Error(`Could not parse transaction payload attributes for ${type}.`);
  }

  return payloadAttribute(data);
}
