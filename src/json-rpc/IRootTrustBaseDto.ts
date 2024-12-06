export interface IRootTrustBaseDto {
  version: bigint;
  epoch: bigint;
  epochStartRound: bigint;
  rootNodes: { [key: string]: INodeInfoDto };
  quorumThreshold: bigint;
  stateHash: string;
  changeRecordHash: string;
  previousEntryHash: string;
  signatures: { [key: string]: string };
}

export interface INodeInfoDto {
  nodeId: string;
  publicKey: string;
  stake: bigint;
}
