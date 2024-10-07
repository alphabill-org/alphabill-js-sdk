/**
 * Payload type.
 */
export enum TransactionOrderType {
  AddFeeCredit = 'addFC',
  BurnFungibleToken = 'burnFToken',
  CloseFeeCredit = 'closeFC',
  CreateFungibleToken = 'createFToken',
  CreateFungibleTokenType = 'createFType',
  CreateNonFungibleToken = 'createNToken',
  CreateNonFungibleTokenType = 'createNType',
  JoinFungibleToken = 'joinFToken',
  LockToken = 'lockToken',
  LockBill = 'lock',
  LockFeeCredit = 'lockFC',
  ReclaimFeeCredit = 'reclFC',
  SplitBill = 'split',
  SplitFungibleToken = 'splitFToken',
  SwapBillsWithDustCollector = 'swapDC',
  TransferBill = 'trans',
  TransferBillToDustCollector = 'transDC',
  TransferFeeCredit = 'transFC',
  TransferFungibleToken = 'transFToken',
  TransferNonFungibleToken = 'transNToken',
  UnlockBill = 'unlock',
  UnlockToken = 'unlockToken',
  UnlockFeeCredit = 'unlockFC',
  UpdateNonFungibleToken = 'updateNToken',
}