import { IUnitId } from './IUnitId.js';
import { IPredicate } from './transaction/predicate/IPredicate.js';

/**
 * Unit interface.
 */
export interface IUnit {
  /**
   * Get unit id.
   * @returns {IUnit} unit id.
   */
  get unitId(): IUnitId;
  /**
   * Get owner predicate.
   * @returns {IPredicate} owner predicate.
   */
  get ownerPredicate(): IPredicate;
  /**
   * Get state proof.
   * @returns {IStateProof | null} state proof.
   */
  get stateProof(): IStateProof | null;
}

export interface IStateProof {
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
   * @returns {IUnitTreeCert} unit tree certificate.
   */
  get unitTreeCert(): IUnitTreeCert;
  /**
   * Get state tree certificate.
   * @returns {IStateTreeCert} state tree certificate.
   */
  get stateTreeCert(): IStateTreeCert;
  /**
   * Get unicity certificate.
   * @returns {unknown} unicity certificate.
   */
  get unicityCertificate(): unknown;
}

export interface IUnitTreeCert {
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

export interface IStateTreeCert {
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
