/**
 * Unit state proof from getUnit.
 */
export interface IStateProofDto {
  readonly version: bigint;
  readonly unitId: string;
  readonly unitValue: bigint;
  readonly unitLedgerHash: string;
  readonly unitTreeCert: IUnitTreeCertificateDto;
  readonly stateTreeCert: IStateTreeCertificateDto;
  readonly unicityCert: string;
}

export interface IUnitTreeCertificateDto {
  readonly txrHash: string;
  readonly dataHash: string;
  readonly path: IPathItemDto[] | null;
}

export interface IPathItemDto {
  readonly hash: string;
  readonly directionLeft: boolean;
}

export interface IStateTreeCertificateDto {
  readonly leftSummaryHash: string;
  readonly leftSummaryValue: bigint;
  readonly rightSummaryHash: string;
  readonly rightSummaryValue: bigint;
  readonly path: IStateTreePathItemDto[];
}

export interface IStateTreePathItemDto {
  readonly unitId: string;
  readonly logsHash: string;
  readonly value: bigint;
  readonly siblingSummaryHash: string;
  readonly siblingSummaryValue: bigint;
}

export interface IUnicityCertificateDto {
  readonly version: bigint;
  readonly inputRecord: IInputRecordDto | null;
  readonly trHash: string;
  readonly shardTreeCertificate: IShardTreeCertificateDto;
  readonly unicityTreeCertificate: IUnicityTreeCertificateDto | null;
  readonly unicitySeal: IUnicitySealDto | null;
}

export interface IInputRecordDto {
  readonly version: bigint;
  readonly previousHash: string;
  readonly hash: string;
  readonly blockHash: string;
  readonly summaryValue: string;
  readonly timestamp: bigint;
  readonly roundNumber: bigint;
  readonly epoch: bigint;
  readonly sumOfEarnedFees: bigint;
}

export interface IShardTreeCertificateDto {
  readonly shard: IShardIdDto;
  readonly siblingHashes: string[];
}

export interface IShardIdDto {
  readonly bits: Uint8Array;
  readonly length: bigint;
}

export interface IUnicityTreeCertificateDto {
  readonly version: bigint;
  readonly partitionIdentifier: bigint;
  readonly hashSteps: IIndexedPathItemDto[] | null;
  readonly partitionDescriptionHash: string;
}

export interface IIndexedPathItemDto {
  readonly key: string;
  readonly hash: string;
}

export interface IUnicitySealDto {
  readonly version: bigint;
  readonly rootChainRoundNumber: bigint;
  readonly timestamp: bigint;
  readonly previousHash: string;
  readonly hash: string;
  readonly signatures: Map<string, Uint8Array>;
}
