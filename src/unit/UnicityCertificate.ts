import { BitString } from '../codec/cbor/BitString.js';
import { CborDecoder } from '../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../codec/cbor/CborEncoder.js';
import { CborTag } from '../codec/cbor/CborTag.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';

/**
 * Unicity certificate.
 */
export class UnicityCertificate {
  /**
   * Unicity certificate constructor.
   * @param {bigint} version - version.
   * @param {InputRecord} inputRecord - unit identifier.
   * @param {Uint8Array | null} _trHash - hash of the technical record.
   * @param {Uint8Array | null} _shardConfHash - hash of the shard configuration.
   * @param {ShardTreeCertificate} shardTreeCertificate - shard tree certificate.
   * @param {UnicityTreeCertificate} unicityTreeCertificate - unicity tree certificate.
   * @param {UnicitySeal} unicitySeal - unicity seal.
   */
  public constructor(
    public readonly version: bigint,
    public readonly inputRecord: InputRecord,
    private readonly _trHash: Uint8Array | null,
    private readonly _shardConfHash: Uint8Array,
    public readonly shardTreeCertificate: ShardTreeCertificate,
    public readonly unicityTreeCertificate: UnicityTreeCertificate,
    public readonly unicitySeal: UnicitySeal,
  ) {
    this.version = BigInt(this.version);
    if (this._trHash) {
      this._trHash = new Uint8Array(this._trHash);
    }
  }

  public get trHash(): Uint8Array | null {
    return this._trHash ? new Uint8Array(this._trHash) : null;
  }

  public get shardConfHash(): Uint8Array {
    return this._shardConfHash;
  }

  /**
   * Create unicity certificate from raw CBOR.
   * @param {Uint8Array} rawData - Unicity certificate as raw CBOR.
   * @returns {UnicityCertificate} Unicity certificate.
   */
  public static fromCbor(rawData: Uint8Array): UnicityCertificate {
    const tag = CborDecoder.readTag(rawData);
    if (Number(tag.tag) !== CborTag.UNICITY_CERTIFICATE) {
      throw new Error(`Invalid tag, expected ${CborTag.UNICITY_CERTIFICATE}, was ` + tag.tag);
    }
    const data = CborDecoder.readArray(tag.data);
    let n = 0;
    return new UnicityCertificate(
      CborDecoder.readUnsignedInteger(data[n++]),
      InputRecord.fromCbor(data[n++]),
      CborDecoder.readOptional(data[n++], CborDecoder.readByteString),
      CborDecoder.readByteString(data[n++]),
      ShardTreeCertificate.fromCbor(data[n++]),
      UnicityTreeCertificate.fromCbor(data[n++]),
      UnicitySeal.fromCbor(data[n++]),
    );
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Unicity certificate as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeTag(
      CborTag.UNICITY_CERTIFICATE,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(this.version),
        this.inputRecord.encode(),
        this._trHash ? CborEncoder.encodeByteString(this._trHash) : CborEncoder.encodeNull(),
        this._shardConfHash ? CborEncoder.encodeByteString(this._shardConfHash) : CborEncoder.encodeNull(),
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
        Technical Record Hash: ${this._trHash ? Base16Converter.encode(this._trHash) : 'null'}
        Shard Conf Hash: ${Base16Converter.encode(this._shardConfHash)}
        ${this.shardTreeCertificate.toString()}
        ${this.unicityTreeCertificate.toString()}
        ${this.unicitySeal.toString()}`;
  }
}

/**
 * Input record.
 */
export class InputRecord {
  /**
   * Input record constructor.
   * @param {bigint} version - version.
   * @param {bigint} roundNumber - shard’s round number.
   * @param {bigint} epoch - shard’s epoch number.
   * @param {Uint8Array | null} _previousHash - previously certified state hash.
   * @param {Uint8Array | null} _hash - state hash to be certified.
   * @param {Uint8Array} _summaryValue - summary value to certified.
   * @param {bigint} timestamp - reference time for transaction validation.
   * @param {Uint8Array | null} _blockHash - hash of the block.
   * @param {bigint} sumOfEarnedFees - sum of the actual fees over all transaction records in the block.
   * @param {Uint8Array | null} _etHash - hash of executed transactions.
   */
  public constructor(
    public readonly version: bigint,
    public readonly roundNumber: bigint,
    public readonly epoch: bigint,
    private readonly _previousHash: Uint8Array | null,
    private readonly _hash: Uint8Array | null,
    private readonly _summaryValue: Uint8Array,
    public readonly timestamp: bigint,
    private readonly _blockHash: Uint8Array | null,
    public readonly sumOfEarnedFees: bigint,
    public readonly _etHash: Uint8Array | null,
  ) {
    this.version = BigInt(this.version);
    this.roundNumber = BigInt(this.roundNumber);
    this.epoch = BigInt(this.epoch);
    if (this._previousHash) {
      this._previousHash = new Uint8Array(this._previousHash);
    }
    if (this._hash) {
      this._hash = new Uint8Array(this._hash);
    }
    this._summaryValue = new Uint8Array(this._summaryValue);
    this.timestamp = BigInt(this.timestamp);
    if (this._blockHash) {
      this._blockHash = new Uint8Array(this._blockHash);
    }
    this.sumOfEarnedFees = BigInt(this.sumOfEarnedFees);
    if (this._etHash) {
      this._etHash = new Uint8Array(this._etHash);
    }
  }

  public get previousHash(): Uint8Array | null {
    return this._previousHash ? new Uint8Array(this._previousHash) : null;
  }

  public get hash(): Uint8Array | null {
    return this._hash ? new Uint8Array(this._hash) : null;
  }

  public get summaryValue(): Uint8Array {
    return new Uint8Array(this._summaryValue);
  }

  public get blockHash(): Uint8Array | null {
    return this._blockHash ? new Uint8Array(this._blockHash) : null;
  }

  /**
   * Create input record from raw CBOR.
   * @param {Uint8Array} rawData - Input record as raw CBOR.
   * @returns {InputRecord} Input record.
   */
  public static fromCbor(rawData: Uint8Array): InputRecord {
    const tag = CborDecoder.readTag(rawData);
    if (Number(tag.tag) !== CborTag.INPUT_RECORD) {
      throw new Error(`Invalid tag, expected ${CborTag.INPUT_RECORD}, was ` + tag.tag);
    }
    const data = CborDecoder.readArray(tag.data);
    return new InputRecord(
      CborDecoder.readUnsignedInteger(data[0]),
      CborDecoder.readUnsignedInteger(data[1]),
      CborDecoder.readUnsignedInteger(data[2]),
      CborDecoder.readOptional(data[3], CborDecoder.readByteString),
      CborDecoder.readOptional(data[4], CborDecoder.readByteString),
      CborDecoder.readByteString(data[5]),
      CborDecoder.readUnsignedInteger(data[6]),
      CborDecoder.readOptional(data[7], CborDecoder.readByteString),
      CborDecoder.readUnsignedInteger(data[8]),
      CborDecoder.readOptional(data[9], CborDecoder.readByteString),
    );
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Input record as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeTag(
      CborTag.INPUT_RECORD,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(this.version),
        CborEncoder.encodeUnsignedInteger(this.roundNumber),
        CborEncoder.encodeUnsignedInteger(this.epoch),
        this._previousHash ? CborEncoder.encodeByteString(this._previousHash) : CborEncoder.encodeNull(),
        this._hash ? CborEncoder.encodeByteString(this._hash) : CborEncoder.encodeNull(),
        CborEncoder.encodeByteString(this._summaryValue),
        CborEncoder.encodeUnsignedInteger(this.timestamp),
        this._blockHash ? CborEncoder.encodeByteString(this._blockHash) : CborEncoder.encodeNull(),
        CborEncoder.encodeUnsignedInteger(this.sumOfEarnedFees),
        this._etHash ? CborEncoder.encodeByteString(this._etHash) : CborEncoder.encodeNull(),
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
        Previous Hash: ${this._previousHash ? Base16Converter.encode(this._previousHash) : 'null'}
        Hash: ${this._hash ? Base16Converter.encode(this._hash) : 'null'}
        Summary Value: ${Base16Converter.encode(this._summaryValue)}
        Timestamp: ${this.timestamp}
        Block Hash: ${this._blockHash ? Base16Converter.encode(this._blockHash) : 'null'}
        Sum Of Earned Fees: ${this.sumOfEarnedFees}
        Executed Transactions Hash: ${this._etHash ? Base16Converter.encode(this._etHash) : 'null'}`;
  }
}

/**
 * Shard tree certificate.
 */
export class ShardTreeCertificate {
  public constructor(
    public readonly shard: BitString,
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
    return new ShardTreeCertificate(BitString.create(data[0]), CborDecoder.readArray(data[1]));
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
        Shard ID: ${this.shard.toString()}
        Sibling Hashes: [${
          this._siblingHashes.length
            ? `\n${this._siblingHashes.map((unit) => Base16Converter.encode(unit)).join('\n')}\n`
            : ''
        }]`;
  }
}

export class HashStep {
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

  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }

  /**
   * Create hash step from raw CBOR.
   * @param {Uint8Array} rawData Hash step as raw CBOR.
   * @returns {HashStep} Hash step.
   */
  public static fromCbor(rawData: Uint8Array): HashStep {
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
 * Unicity tree certificate.
 */
export class UnicityTreeCertificate {
  public constructor(
    public readonly version: bigint,
    public readonly partitionIdentifier: bigint,
    public readonly hashSteps: HashStep[],
  ) {
    this.version = BigInt(version);
    this.partitionIdentifier = BigInt(partitionIdentifier);
  }

  /**
   * Create Unicity tree certificate from raw CBOR.
   * @param {Uint8Array} rawData - Unicity tree certificate as raw CBOR.
   * @returns {UnicityTreeCertificate} Unicity tree certificate.
   */
  public static fromCbor(rawData: Uint8Array): UnicityTreeCertificate {
    const tag = CborDecoder.readTag(rawData);
    if (Number(tag.tag) !== CborTag.UNICITY_TREE_CERTIFICATE) {
      throw new Error(`Invalid tag, expected ${CborTag.UNICITY_TREE_CERTIFICATE}, was ` + tag.tag);
    }
    const data = CborDecoder.readArray(tag.data);
    let n = 0;
    return new UnicityTreeCertificate(
      CborDecoder.readUnsignedInteger(data[n++]),
      CborDecoder.readUnsignedInteger(data[n++]),
      CborDecoder.readArray(data[n++]).map((hashStep) => HashStep.fromCbor(hashStep)),
    );
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Unicity tree certificate as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeTag(
      CborTag.UNICITY_TREE_CERTIFICATE,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(this.version),
        CborEncoder.encodeUnsignedInteger(this.partitionIdentifier),
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
        Hash Steps: [${`\n${this.hashSteps.map((unit: HashStep) => unit.toString()).join('\n')}\n`}]`;
  }
}

/**
 * Unicity seal.
 */
export class UnicitySeal {
  public constructor(
    public readonly version: bigint,
    public readonly networkId: bigint,
    public readonly rootChainRoundNumber: bigint,
    public readonly epoch: bigint,
    public readonly timestamp: bigint,
    private readonly _previousHash: Uint8Array | null,
    private readonly _hash: Uint8Array,
    private readonly _signatures: Map<string, Uint8Array>,
  ) {
    this.version = BigInt(this.version);
    this.networkId = BigInt(this.networkId);
    this.rootChainRoundNumber = BigInt(this.rootChainRoundNumber);
    this.epoch = BigInt(this.epoch);
    this.timestamp = BigInt(this.timestamp);
    if (this._previousHash) {
      this._previousHash = new Uint8Array(this._previousHash);
    }
    this._hash = new Uint8Array(this._hash);
    this._signatures = new Map(Array.from(this._signatures).map(([id, signature]) => [id, new Uint8Array(signature)]));
  }

  public get previousHash(): Uint8Array | null {
    return this._previousHash ? new Uint8Array(this._previousHash) : null;
  }

  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }

  public get signatures(): Map<string, Uint8Array> {
    return new Map(Array.from(this._signatures).map(([id, signature]) => [id, new Uint8Array(signature)]));
  }

  /**
   * Create unicity seal from raw CBOR.
   * @param {Uint8Array} rawData - Unicity seal as raw CBOR.
   * @returns {UnicitySeal} Unicity seal.
   */
  public static fromCbor(rawData: Uint8Array): UnicitySeal {
    const tag = CborDecoder.readTag(rawData);
    if (Number(tag.tag) !== CborTag.UNICITY_SEAL) {
      throw new Error(`Invalid tag, expected ${CborTag.UNICITY_SEAL}, was ` + tag.tag);
    }
    const data = CborDecoder.readArray(tag.data);
    return new UnicitySeal(
      CborDecoder.readUnsignedInteger(data[0]),
      CborDecoder.readUnsignedInteger(data[1]),
      CborDecoder.readUnsignedInteger(data[2]),
      CborDecoder.readUnsignedInteger(data[3]),
      CborDecoder.readUnsignedInteger(data[4]),
      CborDecoder.readOptional(data[5], CborDecoder.readByteString),
      CborDecoder.readByteString(data[6]),
      new Map(
        Array.from(CborDecoder.readMap(data[7]).entries()).map(([id, signature]) => [
          CborDecoder.readTextString(Base16Converter.decode(id)),
          CborDecoder.readByteString(signature),
        ]),
      ),
    );
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Unicity seal as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeTag(
      CborTag.UNICITY_SEAL,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(this.version),
        CborEncoder.encodeUnsignedInteger(this.networkId),
        CborEncoder.encodeUnsignedInteger(this.rootChainRoundNumber),
        CborEncoder.encodeUnsignedInteger(this.epoch),
        CborEncoder.encodeUnsignedInteger(this.timestamp),
        this._previousHash ? CborEncoder.encodeByteString(this._previousHash) : CborEncoder.encodeNull(),
        CborEncoder.encodeByteString(this._hash),
        CborEncoder.encodeMap(
          new Map(
            Array.from(this._signatures.entries()).map(([id, signature]) => [
              Base16Converter.encode(CborEncoder.encodeTextString(id)),
              CborEncoder.encodeByteString(signature),
            ]),
          ),
        ),
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
        Network ID: ${this.networkId}
        Root Chain Round Number: ${this.rootChainRoundNumber}
        Epoch: ${this.epoch}
        Timestamp: ${this.timestamp}
        Previous Hash: ${this._previousHash ? Base16Converter.encode(this._previousHash) : 'null'}
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
