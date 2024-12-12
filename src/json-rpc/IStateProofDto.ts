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
  readonly directionLeft: boolean;
  readonly hash: string;
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
