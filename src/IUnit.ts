import { IUnitId } from './IUnitId.js';

export interface IUnit<T> {
  readonly unitId: IUnitId;
  readonly data: T;
  readonly ownerPredicate: Uint8Array;
  readonly stateProof: {
    readonly unitId: IUnitId;
    readonly unitValue: bigint;
    readonly unitLedgerHash: Uint8Array;
    readonly unitTreeCert: {
      readonly transactionRecordHash: Uint8Array;
      readonly unitDataHash: Uint8Array;
      readonly path: IPathItem[];
    };
    readonly stateTreeCert: {
      readonly leftSummaryHash: Uint8Array;
      readonly LeftSummaryValue: bigint;
      readonly rightSummaryHash: Uint8Array;
      readonly rightSummaryValue: bigint;
      readonly path: {
        readonly unitId: Uint8Array;
        readonly logsHash: Uint8Array;
        readonly value: bigint;
        readonly siblingSummaryHash: Uint8Array;
        readonly siblingSummaryValue: bigint;
      };
    };
    readonly unicityCertificate: {
      readonly inputRecord: {
        readonly previousHash: Uint8Array;
        readonly hash: Uint8Array;
        readonly blockHash: Uint8Array;
        readonly summaryValue: Uint8Array;
        readonly roundNumber: bigint;
        readonly sumOfEarnedFees: bigint;
      };
      readonly unicityTreeCertificate: {
        readonly systemIdentifier: bigint;
        readonly siblingHashes: IPathItem[];
        readonly systemDescriptionHash: Uint8Array;
      };
      readonly unicitySeal: {
        readonly rootChainRoundNumber: bigint;
        readonly timestamp: bigint;
        readonly previousHash: Uint8Array;
        readonly hash: Uint8Array;
        readonly signatures: Map<string, Uint8Array>;
      };
    };
  };
}

interface IPathItem {
  readonly hash: Uint8Array;
  readonly directionLeft: boolean;
}
