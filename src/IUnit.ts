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
  get unitId(): IUnitId;
  /**
   * Get unit data
   * @returns {T} unit data
   */
  get data(): T;
  /**
   * Get owner predicate
   * @returns {Uint8Array} owner predicate
   */
  get ownerPredicate(): Uint8Array;
  /**
   * Get state proof
   * @returns {IStateProof | null} state proof
   */
  get stateProof(): IStateProof | null;
}

export interface IStateProof {
  get unitId(): IUnitId;
  get unitValue(): bigint;
  get unitLedgerHash(): Uint8Array;
  get unitTreeCert(): IUnitTreeCert;
  get stateTreeCert(): IStateTreeCert;
  get unicityCertificate(): unknown;
}

export interface IUnitTreeCert {
  get transactionRecordHash(): Uint8Array;
  get unitDataHash(): Uint8Array;
  get path(): readonly IPathItem[] | null;
}

export interface IStateTreeCert {
  get leftSummaryHash(): Uint8Array;
  get leftSummaryValue(): bigint;
  get rightSummaryHash(): Uint8Array;
  get rightSummaryValue(): bigint;
  get path(): readonly IStateTreePathItem[] | null;
}

export interface IPathItem {
  get hash(): Uint8Array;
  get left(): boolean;
}

export interface IStateTreePathItem {
  get unitId(): IUnitId;
  get logsHash(): Uint8Array;
  get value(): bigint;
  get siblingSummaryHash(): Uint8Array;
  get siblingSummaryValue(): bigint;
}
