import { AddFeeCreditAttributes } from './AddFeeCreditAttributes.js';
import { BurnFungibleTokenAttributes } from './BurnFungibleTokenAttributes.js';
import { CloseFeeCreditAttributes } from './CloseFeeCreditAttributes.js';
import { CreateFungibleTokenAttributes } from './CreateFungibleTokenAttributes.js';
import { CreateFungibleTokenTypeAttributes } from './CreateFungibleTokenTypeAttributes.js';
import { CreateNonFungibleTokenAttributes } from './CreateNonFungibleTokenAttributes.js';
import { CreateNonFungibleTokenTypeAttributes } from './CreateNonFungibleTokenTypeAttributes.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { JoinFungibleTokenAttributes } from './JoinFungibleTokenAttributes.js';
import { LockBillAttributes } from './LockBillAttributes.js';
import { LockFeeCreditAttributes } from './LockFeeCreditAttributes.js';
import { LockTokenAttributes } from './LockTokenAttributes.js';
import { ReclaimFeeCreditAttributes } from './ReclaimFeeCreditAttributes.js';
import { SplitBillAttributes } from './SplitBillAttributes.js';
import { SplitFungibleTokenAttributes } from './SplitFungibleTokenAttributes.js';
import { SwapBillsWithDustCollectorAttributes } from './SwapBillsWithDustCollectorAttributes.js';
import { TransferBillAttributes } from './TransferBillAttributes.js';
import { TransferBillToDustCollectorAttributes } from './TransferBillToDustCollectorAttributes.js';
import { TransferFeeCreditAttributes } from './TransferFeeCreditAttributes.js';
import { TransferFungibleTokenAttributes } from './TransferFungibleTokenAttributes.js';
import { TransferNonFungibleTokenAttributes } from './TransferNonFungibleTokenAttributes.js';
import { UnlockBillAttributes } from './UnlockBillAttributes.js';
import { UnlockFeeCreditAttributes } from './UnlockFeeCreditAttributes.js';
import { UnlockTokenAttributes } from './UnlockTokenAttributes.js';
import { UpdateNonFungibleTokenAttributes } from './UpdateNonFungibleTokenAttributes.js';

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
