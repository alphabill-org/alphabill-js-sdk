import { IUnitId } from './IUnitId.js';

export interface IUnit<T> {
  readonly unitId: IUnitId;
  readonly data: T;
  readonly ownerPredicate: Uint8Array;
  readonly stateProof: IStateProof | null;
}

export interface IStateProof {
  readonly unitId: IUnitId;
  readonly unitValue: bigint;
  readonly unitLedgerHash: Uint8Array;
  readonly unitTreeCert: IUnitTreeCert;
  readonly stateTreeCert: IStateTreeCert;
  readonly unicityCertificate: unknown;
}

export interface IUnitTreeCert {
  readonly transactionRecordHash: Uint8Array;
  readonly unitDataHash: Uint8Array;
  readonly path: IPathItem[] | null;
}

export interface IStateTreeCert {
  readonly leftSummaryHash: Uint8Array;
  readonly leftSummaryValue: bigint;
  readonly rightSummaryHash: Uint8Array;
  readonly rightSummaryValue: bigint;
  readonly path:
    | {
        readonly unitId: IUnitId;
        readonly logsHash: Uint8Array;
        readonly value: bigint;
        readonly siblingSummaryHash: Uint8Array;
        readonly siblingSummaryValue: bigint;
      }[]
    | null;
}

interface IPathItem {
  readonly hash: Uint8Array;
  readonly directionLeft: boolean;
}
