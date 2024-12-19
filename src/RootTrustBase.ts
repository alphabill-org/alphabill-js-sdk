import { INodeInfoDto, IRootTrustBaseDto } from './json-rpc/IRootTrustBaseDto.js';
import { Base16Converter } from './util/Base16Converter.js';

export class RootTrustBase {
  public constructor(
    public readonly version: bigint,
    public readonly epoch: bigint,
    public readonly epochStartRound: bigint,
    public readonly rootNodes: Map<string, NodeInfo>,
    public readonly quorumThreshold: bigint,
    private readonly _stateHash: Uint8Array,
    private readonly _changeRecordHash: Uint8Array,
    private readonly _previousEntryHash: Uint8Array,
    private readonly _signatures: Map<string, Uint8Array>,
  ) {
    this.version = BigInt(this.version);
    this.epoch = BigInt(this.epoch);
    this.epochStartRound = BigInt(this.epochStartRound);
    this.quorumThreshold = BigInt(this.quorumThreshold);
    this._stateHash = new Uint8Array(this._stateHash);
    this._changeRecordHash = new Uint8Array(this._changeRecordHash);
    this._previousEntryHash = new Uint8Array(this._previousEntryHash);
    this._signatures = new Map(Array.from(this._signatures).map(([id, signature]) => [id, new Uint8Array(signature)]));
  }

  public get stateHash(): Uint8Array {
    return new Uint8Array(this._stateHash);
  }

  public get changeRecordHash(): Uint8Array {
    return new Uint8Array(this._changeRecordHash);
  }

  public get previousEntryHash(): Uint8Array {
    return new Uint8Array(this._previousEntryHash);
  }

  public get signatures(): Map<string, Uint8Array> {
    return new Map(Array.from(this._signatures).map(([id, signature]) => [id, new Uint8Array(signature)]));
  }

  public static create(data: IRootTrustBaseDto): RootTrustBase {
    return new RootTrustBase(
      data.version,
      data.epoch,
      data.epochStartRound,
      new Map(Object.entries(data.rootNodes).map(([nodeId, nodeInfoDto]) => [nodeId, NodeInfo.create(nodeInfoDto)])),
      data.quorumThreshold,
      Base16Converter.decode(data.stateHash),
      Base16Converter.decode(data.changeRecordHash),
      Base16Converter.decode(data.previousEntryHash),
      new Map(Object.entries(data.signatures).map(([id, signature]) => [id, Base16Converter.decode(signature)])),
    );
  }
}

export class NodeInfo {
  public constructor(
    public readonly nodeId: string,
    private readonly _publicKey: Uint8Array,
    public readonly stake: bigint,
  ) {
    this._publicKey = new Uint8Array(_publicKey);
    this.stake = BigInt(this.stake);
  }

  public get publicKey(): Uint8Array {
    return new Uint8Array(this._publicKey);
  }

  public static create(data: INodeInfoDto): NodeInfo {
    return new NodeInfo(data.nodeId, Base16Converter.decode(data.publicKey), data.stake);
  }
}
