import { IUnitId } from './IUnitId.js';

export interface IStateProof {
  /**
   * Get version.
   * @returns {bigint} Version.
   */
  get version(): bigint;
  /**
   * Get unit id.
   * @returns {IUnitId} unit id.
   */
  get unitId(): IUnitId;
  /**
   * Get unit value.
   * @returns {bigint} unit value.
   */
  get unitValue(): bigint;
  /**
   * Get unit ledger hash.
   * @returns {Uint8Array} unit ledger hash.
   */
  get unitLedgerHash(): Uint8Array;
  /**
   * Get unit tree certificate.
   * @returns {IUnitTreeCertificate} unit tree certificate.
   */
  get unitTreeCertificate(): IUnitTreeCertificate;
  /**
   * Get state tree certificate.
   * @returns {IStateTreeCertificate} state tree certificate.
   */
  get stateTreeCertificate(): IStateTreeCertificate;
  /**
   * Get unicity certificate.
   * @returns {IUnicityCertificate} unicity certificate.
   */
  get unicityCertificate(): IUnicityCertificate;
}

export interface IUnitTreeCertificate {
  /**
   * Get transaction record hash.
   * @returns {Uint8Array} transaction record hash.
   */
  get transactionRecordHash(): Uint8Array;
  /**
   * Get unit data hash.
   * @returns {Uint8Array} unit data hash.
   */
  get unitDataHash(): Uint8Array;
  /**
   * Get path.
   * @returns {IPathItem[] | null} path.
   */
  get path(): readonly IPathItem[] | null;
}

export interface IStateTreeCertificate {
  /**
   * Get left summary hash.
   * @returns {Uint8Array} left summary hash.
   */
  get leftSummaryHash(): Uint8Array;
  /**
   * Get left summary value.
   * @returns {bigint} left summary value.
   */
  get leftSummaryValue(): bigint;
  /**
   * Get right summary hash.
   * @returns {Uint8Array} right summary hash.
   */
  get rightSummaryHash(): Uint8Array;
  /**
   * Get right summary value.
   * @returns {bigint} right summary value.
   */
  get rightSummaryValue(): bigint;
  /**
   * Get path.
   * @returns {IStateTreePathItem[] | null} path.
   */
  get path(): readonly IStateTreePathItem[] | null;
}

export interface IPathItem {
  /**
   * Get hash.
   * @returns {Uint8Array} hash.
   */
  get hash(): Uint8Array;
  /**
   * Get value.
   * @returns {bigint} value.
   */
  get left(): boolean;
}

export interface IStateTreePathItem {
  /**
   * Get unit id.
   * @returns {IUnitId} unit id.
   */
  get unitId(): IUnitId;
  /**
   * Get logs hash.
   * @returns {Uint8Array} logs hash.
   */
  get logsHash(): Uint8Array;
  /**
   * Get value.
   * @returns {bigint} value.
   */
  get value(): bigint;
  /**
   * Get sibling summary hash.
   * @returns {Uint8Array} sibling summary hash.
   */
  get siblingSummaryHash(): Uint8Array;
  /**
   * Get sibling summary value.
   * @returns {bigint} sibling summary value.
   */
  get siblingSummaryValue(): bigint;
}

export interface IUnicityCertificate {
  get version(): bigint;
  get inputRecord(): IInputRecord | null;
  get trHash(): Uint8Array;
  get shardTreeCertificate(): IShardTreeCertificate;
  get unicityTreeCertificate(): IUnicityTreeCertificate | null;
  get unicitySeal(): IUnicitySeal | null;
  encode(): Uint8Array;
}

export interface IInputRecord {
  get version(): bigint;
  get previousHash(): Uint8Array;
  get hash(): Uint8Array;
  get blockHash(): Uint8Array;
  get summaryValue(): Uint8Array;
  get roundNumber(): bigint;
  get epoch(): bigint;
  get sumOfEarnedFees(): bigint;
  encode(): Uint8Array;
}

export interface IShardTreeCertificate {
  get shard(): IShardId;
  get siblingHashes(): Uint8Array[];
  encode(): Uint8Array;
}

export interface IShardId {
  get bits(): Uint8Array;
  get length(): bigint;
  encode(): Uint8Array;
}

export interface IUnicityTreeCertificate {
  get version(): bigint;
  get partitionIdentifier(): bigint;
  get hashSteps(): IIndexedPathItem[] | null;
  get partitionDescriptionHash(): Uint8Array;
  encode(): Uint8Array;
}

export interface IIndexedPathItem {
  get key(): Uint8Array;
  get hash(): Uint8Array;
  encode(): Uint8Array;
}

export interface IUnicitySeal {
  get version(): bigint;
  get rootChainRoundNumber(): bigint;
  get timestamp(): bigint;
  get previousHash(): Uint8Array;
  get hash(): Uint8Array;
  get signatures(): Map<string, Uint8Array>;
  encode(): Uint8Array;
}
