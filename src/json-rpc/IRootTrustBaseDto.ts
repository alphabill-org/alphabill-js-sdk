export interface IRootTrustBaseDto {
  readonly version: bigint;
  readonly epoch: bigint;
  readonly epochStartRound: bigint;
  readonly rootNodes: { [key: string]: INodeInfoDto };
  readonly quorumThreshold: bigint;
  readonly stateHash: string;
  readonly changeRecordHash: string;
  readonly previousEntryHash: string;
  readonly signatures: { [key: string]: string };
}

export interface INodeInfoDto {
  readonly nodeId: string;
  readonly publicKey: string;
  readonly stake: bigint;
}
