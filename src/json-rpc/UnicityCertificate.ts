import { CborDecoder } from '../codec/cbor/CborDecoder.js';
import {
  IIndexedPathItem,
  IInputRecord,
  IndexedPathItemArray,
  InputRecordArray,
  IShardId,
  IShardTreeCertificate,
  IUnicityCertificate,
  IUnicitySeal,
  IUnicityTreeCertificate,
  ShardIdArray,
  ShardTreeCertificateArray,
  UnicityCertificateArray,
  UnicitySealArray,
  UnicityTreeCertificateArray,
} from '../IStateProof.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';

/**
 * Unicity certificate.
 * @implements {IUnicityCertificate}
 */
export class UnicityCertificate implements IUnicityCertificate {
  /**
   * State proof constructor.
   * @param {bigint} version - version.
   * @param {IInputRecord} inputRecord - unit identifier.
   * @param {Uint8Array} _trHash - hash of the technical record.
   * @param {IShardTreeCertificate} shardTreeCertificate - shard tree certificate.
   * @param {IUnicityTreeCertificate} unicityTreeCertificate - unicity tree certificate.
   * @param {IUnicitySeal} unicitySeal - unicity seal.
   */
  public constructor(
    public readonly version: bigint,
    public readonly inputRecord: IInputRecord | null,
    private readonly _trHash: Uint8Array,
    public readonly shardTreeCertificate: IShardTreeCertificate,
    public readonly unicityTreeCertificate: IUnicityTreeCertificate | null,
    public readonly unicitySeal: IUnicitySeal | null,
  ) {
    this.version = BigInt(this.version);
    this._trHash = new Uint8Array(this._trHash);
  }

  /**
   * @see {IUnicityCertificate.trHash}
   */
  public get trHash(): Uint8Array {
    return new Uint8Array(this._trHash);
  }

  /**
   * Create unicity certificate from raw CBOR.
   * @param {Uint8Array} rawData - Unicity certificate as raw CBOR.
   * @returns {UnicityCertificate} Unicity certificate.
   */
  public static fromCbor(rawData: Uint8Array): UnicityCertificate {
    const data = CborDecoder.readArray(CborDecoder.readTag(rawData).data);
    return new UnicityCertificate(
      CborDecoder.readUnsignedInteger(data[0]),
      data[1] ? InputRecord.fromCbor(data[1]) : null,
      data[2],
      ShardTreeCertificate.fromCbor(data[3]),
      data[4] ? UnicityTreeCertificate.fromCbor(data[4]) : null,
      data[5] ? UnicitySeal.fromCbor(data[5]) : null,
    );
  }

  /**
   * Convert to array.
   * @returns {UnicityCertificateArray} Unicity certificate array.
   */
  public encode(): UnicityCertificateArray {
    return [
      this.version,
      this.inputRecord?.encode() ?? null,
      this.trHash,
      this.shardTreeCertificate.encode(),
      this.unicityTreeCertificate?.encode() ?? null,
      this.unicitySeal?.encode() ?? null,
    ];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      Unicity Certificate
        Version: ${this.version}
        ${this.inputRecord?.toString()}}
        Transaction Record Hash: ${Base16Converter.encode(this.trHash)}
        ${this.shardTreeCertificate.toString()}
        ${this.unicityTreeCertificate?.toString()}
        ${this.unicitySeal?.toString()}`;
  }
}

/**
 * Input record.
 * @implements {IInputRecord}
 */
export class InputRecord implements IInputRecord {
  /**
   * Input record constructor.
   * @param {bigint} version - version.
   * @param {Uint8Array} _previousHash - previously certified state hash.
   * @param {Uint8Array} _hash - state hash to be certified.
   * @param {Uint8Array} _blockHash - hash of the block.
   * @param {Uint8Array} _summaryValue - summary value to certified.
   * @param {bigint} timestamp - reference time for transaction validation.
   * @param {bigint} roundNumber - shard’s round number.
   * @param {bigint} epoch - shard’s epoch number.
   * @param {bigint} sumOfEarnedFees - sum of the actual fees over all transaction records in the block.
   */
  public constructor(
    public readonly version: bigint,
    private readonly _previousHash: Uint8Array,
    private readonly _hash: Uint8Array,
    private readonly _blockHash: Uint8Array,
    private readonly _summaryValue: Uint8Array,
    public readonly timestamp: bigint,
    public readonly roundNumber: bigint,
    public readonly epoch: bigint,
    public readonly sumOfEarnedFees: bigint,
  ) {
    this.version = BigInt(this.version);
    this._previousHash = new Uint8Array(this._previousHash);
    this._hash = new Uint8Array(this._hash);
    this._blockHash = new Uint8Array(this._blockHash);
    this._summaryValue = new Uint8Array(this._summaryValue);
    this.timestamp = BigInt(this.timestamp);
    this.roundNumber = BigInt(this.roundNumber);
    this.epoch = BigInt(this.epoch);
    this.sumOfEarnedFees = BigInt(this.sumOfEarnedFees);
  }

  /**
   * @see {IInputRecord.previousHash}
   */
  public get previousHash(): Uint8Array {
    return new Uint8Array(this._previousHash);
  }

  /**
   * @see {IInputRecord.hash}
   */
  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }

  /**
   * @see {IInputRecord.blockHash}
   */
  public get blockHash(): Uint8Array {
    return new Uint8Array(this._blockHash);
  }

  /**
   * @see {IInputRecord.summaryValue}
   */
  public get summaryValue(): Uint8Array {
    return new Uint8Array(this._summaryValue);
  }

  /**
   * Create input record certificate from raw CBOR.
   * @param {Uint8Array} rawData - Input record as raw CBOR.
   * @returns {InputRecord} Input record.
   */
  public static fromCbor(rawData: Uint8Array): InputRecord {
    const data = CborDecoder.readArray(CborDecoder.readTag(rawData).data);
    return new InputRecord(
      CborDecoder.readUnsignedInteger(data[0]),
      CborDecoder.readByteString(data[1]),
      CborDecoder.readByteString(data[2]),
      CborDecoder.readByteString(data[3]),
      CborDecoder.readByteString(data[4]),
      CborDecoder.readUnsignedInteger(data[5]),
      CborDecoder.readUnsignedInteger(data[6]),
      CborDecoder.readUnsignedInteger(data[7]),
      CborDecoder.readUnsignedInteger(data[8]),
    );
  }

  /**
   * Convert to array.
   * @returns {InputRecordArray} Input record array.
   */
  public encode(): InputRecordArray {
    return [
      this.version,
      this.previousHash,
      this.hash,
      this.blockHash,
      this.summaryValue,
      this.timestamp,
      this.roundNumber,
      this.epoch,
      this.sumOfEarnedFees,
    ];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      Input Record
        Version: ${this.version}
        Previous Hash: ${Base16Converter.encode(this._previousHash)}
        Hash: ${Base16Converter.encode(this._hash)}
        Block Hash: ${Base16Converter.encode(this._blockHash)}
        Summary Value: ${Base16Converter.encode(this._summaryValue)}
        Timestamp: ${this.timestamp}
        Round Number: ${this.roundNumber}
        Epoch: ${this.epoch}
        Sum Of Earned Fees: ${this.sumOfEarnedFees}`;
  }
}

/**
 * Shard tree certificate.
 * @implements {IShardTreeCertificate}
 */
export class ShardTreeCertificate implements IShardTreeCertificate {
  public constructor(
    public readonly shard: IShardId,
    private readonly _siblingHashes: Uint8Array[],
  ) {
    this._siblingHashes = this._siblingHashes.map((siblingHash: Uint8Array) => new Uint8Array(siblingHash));
  }

  public get siblingHashes(): Uint8Array[] {
    return this._siblingHashes.map((siblingHash: Uint8Array) => new Uint8Array(siblingHash));
  }

  /**
   * Create shard tree certificate from raw CBOR.
   * @param {Uint8Array} rawData - Shard tree certificate as raw CBOR.
   * @returns {ShardTreeCertificate} Shard tree certificate.
   */
  public static fromCbor(rawData: Uint8Array): ShardTreeCertificate {
    const data = CborDecoder.readArray(rawData);
    return new ShardTreeCertificate(ShardId.fromCbor(data[0]), CborDecoder.readArray(data[1]));
  }

  /**
   * Convert to array.
   * @returns {ShardTreeCertificateArray} Shard tree certificate array.
   */
  public encode(): ShardTreeCertificateArray {
    return [this.shard.encode(), this.siblingHashes];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      Shard Tree Certificate
        ${this.shard.toString()}
        Sibling Hashes: [${
          this._siblingHashes.length
            ? `\n${this._siblingHashes.map((unit) => Base16Converter.encode(unit)).join('\n')}\n`
            : ''
        }]`;
  }
}

export class IndexedPathItem implements IIndexedPathItem {
  /**
   * Indexed path item constructor.
   * @param _key - key.
   * @param _hash - hash.
   */
  public constructor(
    private readonly _key: Uint8Array,
    private readonly _hash: Uint8Array,
  ) {
    this._key = new Uint8Array(this._key);
    this._hash = new Uint8Array(this._hash);
  }

  /**
   * @see {IIndexedPathItem.key}
   */
  public get key(): Uint8Array {
    return new Uint8Array(this._key);
  }

  /**
   * @see {IIndexedPathItem.hash}
   */
  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }

  /**
   * Create indexed path item from raw CBOR.
   * @param {Uint8Array} rawData - Indexed path item as raw CBOR.
   * @returns {IndexedPathItem} Indexed path item.
   */
  public static fromCbor(rawData: Uint8Array): IndexedPathItem {
    const data = CborDecoder.readArray(rawData);
    return new IndexedPathItem(CborDecoder.readByteString(data[0]), CborDecoder.readByteString(data[1]));
  }

  /**
   * Convert to array.
   * @returns {IndexedPathItemArray} Indexed path item array.
   */
  public encode(): IndexedPathItemArray {
    return [this._key, this._hash];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      Indexed Path Item
        Key: ${Base16Converter.encode(this._key)}
        Hash: ${Base16Converter.encode(this._hash)}`;
  }
}

/**
 * Shard ID.
 * @implements {IShardId}
 */
export class ShardId implements IShardId {
  public constructor(
    private readonly _bits: Uint8Array,
    public readonly length: bigint,
  ) {
    this._bits = new Uint8Array(this._bits);
    this.length = BigInt(this.length);
  }

  /**
   * @see {IShardId.bits}
   */
  public get bits(): Uint8Array {
    return new Uint8Array(this._bits);
  }

  /**
   * Create Shard ID from raw CBOR.
   * @param {Uint8Array} rawData - Shard ID as raw CBOR.
   * @returns {ShardId} Shard ID.
   */
  public static fromCbor(rawData: Uint8Array): ShardId {
    // FIXME
    return new ShardId(CborDecoder.readByteString(rawData), 0n);
  }

  /**
   * Convert to array.
   * @returns {ShardIdArray} Shard ID array.
   */
  public encode(): ShardIdArray {
    return [this.bits, this.length];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      Shard ID
        Bits: ${Base16Converter.encode(this.bits)}
        Length: ${this.length}`;
  }
}

/**
 * Unicity tree certificate.
 * @implements {IUnicityTreeCertificate}
 */
export class UnicityTreeCertificate implements IUnicityTreeCertificate {
  public constructor(
    public readonly version: bigint,
    public readonly partitionIdentifier: bigint,
    public readonly hashSteps: IIndexedPathItem[] | null,
    public readonly _partitionDescriptionHash: Uint8Array,
  ) {
    this.version = BigInt(version);
    this.partitionIdentifier = BigInt(partitionIdentifier);
    this._partitionDescriptionHash = new Uint8Array(_partitionDescriptionHash);
  }

  /**
   * @see {IUnicityTreeCertificate.partitionDescriptionHash}
   */
  public get partitionDescriptionHash(): Uint8Array {
    return new Uint8Array(this._partitionDescriptionHash);
  }

  /**
   * Create Unicity tree certificate from raw CBOR.
   * @param {Uint8Array} rawData - Unicity tree certificate as raw CBOR.
   * @returns {UnicityTreeCertificate} Unicity tree certificate.
   */
  public static fromCbor(rawData: Uint8Array): UnicityTreeCertificate {
    const data = CborDecoder.readArray(CborDecoder.readTag(rawData).data);
    return new UnicityTreeCertificate(
      CborDecoder.readUnsignedInteger(data[0]),
      CborDecoder.readUnsignedInteger(data[1]),
      CborDecoder.readArray(data[2])?.map((pathItem: Uint8Array) => IndexedPathItem.fromCbor(pathItem)) ?? null,
      CborDecoder.readByteString(data[3]),
    );
  }

  /**
   * Convert to array.
   * @returns {UnicityTreeCertificateArray} Unicity tree certificate array.
   */
  public encode(): UnicityTreeCertificateArray {
    return [
      this.version,
      this.partitionIdentifier,
      this.hashSteps?.map((pathItem: IIndexedPathItem) => pathItem.encode()) ?? null,
      this._partitionDescriptionHash,
    ];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      Unicity Tree Certificate
        Version: ${this.version}
        Partition ID: ${this.partitionIdentifier}
        Hash Steps: [${
          this.hashSteps?.length
            ? `\n${this.hashSteps.map((unit: IIndexedPathItem) => unit.toString()).join('\n')}\n`
            : ''
        }]
        Partition Description Hash: ${Base16Converter.encode(this._partitionDescriptionHash)}`;
  }
}

/**
 * Unicity seal.
 * @implements {IUnicitySeal}
 */
export class UnicitySeal implements IUnicitySeal {
  public constructor(
    public readonly version: bigint,
    public readonly rootChainRoundNumber: bigint,
    public readonly timestamp: bigint,
    private readonly _previousHash: Uint8Array,
    private readonly _hash: Uint8Array,
    private readonly _signatures: Map<string, Uint8Array>,
  ) {
    this.version = BigInt(this.version);
    this.rootChainRoundNumber = BigInt(this.rootChainRoundNumber);
    this.timestamp = BigInt(this.timestamp);
    this._previousHash = new Uint8Array(this._previousHash);
    this._hash = new Uint8Array(this._hash);
    this._signatures = new Map(Array.from(this._signatures).map(([id, signature]) => [id, new Uint8Array(signature)]));
  }

  /**
   * @see {IUnicitySeal.previousHash}
   */
  public get previousHash(): Uint8Array {
    return new Uint8Array(this._previousHash);
  }

  /**
   * @see {IUnicitySeal.hash}
   */
  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }

  /**
   * @see {IUnicitySeal.signatures}
   */
  public get signatures(): Map<string, Uint8Array> {
    return new Map(Array.from(this._signatures).map(([id, signature]) => [id, new Uint8Array(signature)]));
  }

  /**
   * Create unicity seal from raw CBOR.
   * @param {Uint8Array} rawData - Unicity seal as raw CBOR.
   * @returns {UnicitySeal} Unicity seal.
   */
  public static fromCbor(rawData: Uint8Array): UnicitySeal {
    const data = CborDecoder.readArray(rawData);
    return new UnicitySeal(
      CborDecoder.readUnsignedInteger(data[0]),
      CborDecoder.readUnsignedInteger(data[1]),
      CborDecoder.readUnsignedInteger(data[2]),
      CborDecoder.readByteString(data[3]),
      CborDecoder.readByteString(data[4]),
      new Map(), // TODO
    );
  }

  /**
   * Convert to array.
   * @returns {UnicitySealArray} Unicity seal array.
   */
  public encode(): UnicitySealArray {
    return [this.version, this.rootChainRoundNumber, this.timestamp, this.previousHash, this.hash, this.signatures];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      Unicity Seal
        Version: ${this.version}
        Root Chain Round Number: ${this.rootChainRoundNumber}
        Timestamp: ${this.timestamp}
        Previous Hash: ${Base16Converter.encode(this._previousHash)}
        Hash: ${Base16Converter.encode(this._hash)}
        Signatures: [${
          this._signatures.entries()
            ? `\n${Array.from(this._signatures)
                .map(([id, signature]) => 'ID: ' + id + ', Signature: ' + Base16Converter.encode(signature))
                .join('\n')}\n`
            : ''
        }]`;
  }
}
