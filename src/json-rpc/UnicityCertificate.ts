import { CborDecoder } from '../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../codec/cbor/CborEncoder.js';
import {
  IInputRecord,
  IShardId,
  IShardTreeCertificate,
  IUnicityCertificate,
  IUnicitySeal,
  IUnicityTreeCertificate,
  IHashStep,
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
    public readonly inputRecord: IInputRecord,
    private readonly _trHash: Uint8Array,
    public readonly shardTreeCertificate: IShardTreeCertificate,
    public readonly unicityTreeCertificate: IUnicityTreeCertificate,
    public readonly unicitySeal: IUnicitySeal,
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
      InputRecord.fromCbor(data[1]),
      CborDecoder.readByteString(data[2]),
      ShardTreeCertificate.fromCbor(data[3]),
      UnicityTreeCertificate.fromCbor(data[4]),
      UnicitySeal.fromCbor(data[5]),
    );
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Unicity certificate as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeTag(
      1007,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(this.version),
        this.inputRecord.encode(),
        CborEncoder.encodeByteString(this._trHash),
        this.shardTreeCertificate.encode(),
        this.unicityTreeCertificate.encode(),
        this.unicitySeal.encode(),
      ]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      Unicity Certificate
        Version: ${this.version}
        ${this.inputRecord.toString()}}
        Transaction Record Hash: ${Base16Converter.encode(this.trHash)}
        ${this.shardTreeCertificate.toString()}
        ${this.unicityTreeCertificate.toString()}
        ${this.unicitySeal.toString()}`;
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
   * @param {bigint} roundNumber - shard’s round number.
   * @param {bigint} epoch - shard’s epoch number.
   * @param {Uint8Array} _previousHash - previously certified state hash.
   * @param {Uint8Array} _hash - state hash to be certified.
   * @param {Uint8Array} _summaryValue - summary value to certified.
   * @param {bigint} timestamp - reference time for transaction validation.
   * @param {Uint8Array} _blockHash - hash of the block.
   * @param {bigint} sumOfEarnedFees - sum of the actual fees over all transaction records in the block.
   */
  public constructor(
    public readonly version: bigint,
    public readonly roundNumber: bigint,
    public readonly epoch: bigint,
    private readonly _previousHash: Uint8Array,
    private readonly _hash: Uint8Array,
    private readonly _summaryValue: Uint8Array,
    public readonly timestamp: bigint,
    private readonly _blockHash: Uint8Array,
    public readonly sumOfEarnedFees: bigint,
  ) {
    this.version = BigInt(this.version);
    this.roundNumber = BigInt(this.roundNumber);
    this.epoch = BigInt(this.epoch);
    this._previousHash = new Uint8Array(this._previousHash);
    this._hash = new Uint8Array(this._hash);
    this._summaryValue = new Uint8Array(this._summaryValue);
    this.timestamp = BigInt(this.timestamp);
    this._blockHash = new Uint8Array(this._blockHash);
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
   * @see {IInputRecord.summaryValue}
   */
  public get summaryValue(): Uint8Array {
    return new Uint8Array(this._summaryValue);
  }

  /**
   * @see {IInputRecord.blockHash}
   */
  public get blockHash(): Uint8Array {
    return new Uint8Array(this._blockHash);
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
      CborDecoder.readUnsignedInteger(data[1]),
      CborDecoder.readUnsignedInteger(data[2]),
      CborDecoder.readByteString(data[3]),
      CborDecoder.readByteString(data[4]),
      CborDecoder.readByteString(data[5]),
      CborDecoder.readUnsignedInteger(data[6]),
      CborDecoder.readByteString(data[7]),
      CborDecoder.readUnsignedInteger(data[8]),
    );
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Input record as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeTag(
      1008,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(this.version),
        CborEncoder.encodeUnsignedInteger(this.roundNumber),
        CborEncoder.encodeUnsignedInteger(this.epoch),
        CborEncoder.encodeByteString(this._previousHash),
        CborEncoder.encodeByteString(this._hash),
        CborEncoder.encodeByteString(this._summaryValue),
        CborEncoder.encodeUnsignedInteger(this.timestamp),
        CborEncoder.encodeByteString(this._blockHash),
        CborEncoder.encodeUnsignedInteger(this.sumOfEarnedFees),
      ]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      Input Record
        Version: ${this.version}
        Round Number: ${this.roundNumber}
        Epoch: ${this.epoch}
        Previous Hash: ${Base16Converter.encode(this._previousHash)}
        Hash: ${Base16Converter.encode(this._hash)}
        Summary Value: ${Base16Converter.encode(this._summaryValue)}
        Timestamp: ${this.timestamp}
        Block Hash: ${Base16Converter.encode(this._blockHash)}
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
   * Convert to raw CBOR.
   * @returns {Uint8Array} Shard tree certificate as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      this.shard.encode(),
      CborEncoder.encodeArray(this.siblingHashes.map((hash: Uint8Array) => CborEncoder.encodeByteString(hash))),
    ]);
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

export class HashStep implements IHashStep {
  /**
   * Hash step constructor.
   * @param key - key.
   * @param _hash - hash.
   */
  public constructor(
    public readonly key: bigint,
    private readonly _hash: Uint8Array,
  ) {
    this.key = BigInt(this.key);
    this._hash = new Uint8Array(this._hash);
  }

  /**
   * @see {IHashStep.hash}
   */
  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }

  /**
   * Create hash step from raw CBOR.
   * @param {Uint8Array} rawData Hash step as raw CBOR.
   * @returns {HashStep} Hash step.
   */
  public static fromCbor(rawData: Uint8Array): IHashStep {
    const data = CborDecoder.readArray(rawData);
    return new HashStep(CborDecoder.readUnsignedInteger(data[0]), CborDecoder.readByteString(data[1]));
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Hash step as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeUnsignedInteger(this.key),
      CborEncoder.encodeByteString(this._hash),
    ]);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      Hash Step
        Key: ${this.key}
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
    public readonly length: number,
  ) {
    this._bits = new Uint8Array(this._bits);
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
    const decodedShardId = CborDecoder.readBitString(rawData);
    return new ShardId(decodedShardId.data, decodedShardId.length);
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Shard ID as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeBitString(this.bits, this.length);
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
    public readonly _partitionDescriptionHash: Uint8Array,
    public readonly hashSteps: IHashStep[],
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
      CborDecoder.readByteString(data[2]),
      CborDecoder.readArray(data[3]).map((hashStep) => HashStep.fromCbor(hashStep)),
    );
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Unicity tree certificate as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeTag(
      1014,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(this.version),
        CborEncoder.encodeUnsignedInteger(this.partitionIdentifier),
        CborEncoder.encodeByteString(this._partitionDescriptionHash),
        CborEncoder.encodeArray(this.hashSteps.map((hashStep) => hashStep.encode())),
      ]),
    );
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
        Hash Steps: [${`\n${this.hashSteps.map((unit: IHashStep) => unit.toString()).join('\n')}\n`}]
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
    const data = CborDecoder.readArray(CborDecoder.readTag(rawData).data);
    return new UnicitySeal(
      CborDecoder.readUnsignedInteger(data[0]),
      CborDecoder.readUnsignedInteger(data[1]),
      CborDecoder.readUnsignedInteger(data[2]),
      CborDecoder.readByteString(data[3]),
      CborDecoder.readByteString(data[4]),
      CborDecoder.readMap(data[5]),
    );
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Unicity seal as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeTag(
      1001,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(this.version),
        CborEncoder.encodeUnsignedInteger(this.rootChainRoundNumber),
        CborEncoder.encodeUnsignedInteger(this.timestamp),
        CborEncoder.encodeByteString(this._previousHash),
        CborEncoder.encodeByteString(this._hash),
        CborEncoder.encodeMap(this._signatures),
      ]),
    );
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
