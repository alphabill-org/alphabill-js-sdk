import { IUnitId } from './IUnitId.js';

/**
 * Unit interface
 * @template T - type of unit.
 */
export interface IUnit<T> {
  /**
   * Get unit id
   * @returns {IUnit} unit id
   */
  getUnitId(): IUnitId;
  /**
   * Get unit data
   * @returns {T} unit data
   */
  getData(): T;
  /**
   * Get owner predicate
   * @returns {Uint8Array} owner predicate
   */
  getOwnerPredicate(): Uint8Array;
  /**
   * Get state proof
   * @returns {IStateProof | null} state proof
   */
  getStateProof(): IStateProof | null;
}

export interface IStateProof {
  getUnitId(): IUnitId;
  getUnitValue(): bigint;
  getUnitLedgerHash(): Uint8Array;
  getUnitTreeCert(): IUnitTreeCert;
  getStateTreeCert(): IStateTreeCert;
  getUnicityCertificate(): unknown;
}

export interface IUnitTreeCert {
  getTransactionRecordHash(): Uint8Array;
  getUnitDataHash(): Uint8Array;
  getPath(): readonly IPathItem[] | null;
}

export interface IStateTreeCert {
  getLeftSummaryHash(): Uint8Array;
  getLeftSummaryValue(): bigint;
  getRightSummaryHash(): Uint8Array;
  getRightSummaryValue(): bigint;
  getPath(): readonly IStateTreePathItem[] | null;
}

export interface IPathItem {
  getHash(): Uint8Array;
  isLeft(): boolean;
}

export interface IStateTreePathItem {
  getUnitId(): IUnitId;
  getLogsHash(): Uint8Array;
  getValue(): bigint;
  getSiblingSummaryHash(): Uint8Array;
  getSiblingSummaryValue(): bigint;
}
