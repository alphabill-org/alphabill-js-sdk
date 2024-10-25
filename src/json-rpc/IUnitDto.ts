/**
 * Unit state proof from getUnit.
 */
export interface IStateProofDto {
  readonly unitId: string;
  readonly unitValue: bigint;
  readonly unitLedgerHash: string;
  readonly unitTreeCert: IUnitTreeCertDto;
  readonly stateTreeCert: IStateTreeCertDto;
  // TODO: Unicity certificate has data inconsistent with other data formats, keeping it as is for now
  readonly unicityCert: unknown;
}

export interface IUnitTreeCertDto {
  readonly txrHash: string;
  readonly dataHash: string;
  readonly path: IPathItem[] | null;
}

export interface IStateTreeCertDto {
  readonly leftSummaryHash: string;
  readonly leftSummaryValue: bigint;
  readonly rightSummaryHash: string;
  readonly rightSummaryValue: bigint;
  readonly path: {
    readonly unitId: string;
    readonly logsHash: string;
    readonly value: bigint;
    readonly siblingSummaryHash: string;
    readonly siblingSummaryValue: bigint;
  }[];
}

interface IPathItem {
  readonly Hash: string;
  readonly DirectionLeft: boolean;
}
