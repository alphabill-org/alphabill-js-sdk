export interface IUnitDto {
  readonly unitId: string;
  readonly data: unknown;
  readonly ownerPredicate: string;
  readonly stateProof: {
    readonly unitId: string;
    readonly unitValue: string;
    readonly unitLedgerHash: string;
    readonly unitTreeCert: {
      readonly transactionRecordHash: string;
      readonly unitDataHash: string;
      readonly path: IPathItem[];
    };
    readonly stateTreeCert: {
      readonly leftSummaryHash: string;
      readonly LeftSummaryValue: string;
      readonly rightSummaryHash: string;
      readonly rightSummaryValue: string;
      readonly path: {
        readonly unitId: string;
        readonly logsHash: string;
        readonly value: string;
        readonly siblingSummaryHash: string;
        readonly siblingSummaryValue: string;
      };
    };
    readonly unicityCertificate: {
      readonly inputRecord: {
        readonly previousHash: string;
        readonly hash: string;
        readonly blockHash: string;
        readonly summaryValue: string;
        readonly roundNumber: string;
        readonly sumOfEarnedFees: string;
      };
      readonly unicityTreeCertificate: {
        readonly systemIdentifier: string;
        readonly siblingHashes: IPathItem[];
        readonly systemDescriptionHash: string;
      };
      readonly unicitySeal: {
        readonly rootChainRoundNumber: string;
        readonly timestamp: string;
        readonly previousHash: string;
        readonly hash: string;
        readonly signatures: Map<string, string>;
      };
    };
  };
}

interface IPathItem {
  readonly hash: string;
  readonly directionLeft: boolean;
}
