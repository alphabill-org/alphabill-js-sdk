import { IUnitId } from '../IUnitId.js';
import {
  IPathItemDto,
  IStateProofDto,
  IStateTreeCertificateDto,
  IStateTreePathItemDto,
  IUnitTreeCertificateDto,
} from '../json-rpc/IStateProofDto.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { UnicityCertificate } from './UnicityCertificate.js';

/**
 * State proof.
 */
export class StateProof {
  /**
   * State proof constructor.
   * @param {bigint} version - version.
   * @param {IUnitId} unitId - unit identifier.
   * @param {bigint} unitValue - unit value.
   * @param {Uint8Array} _unitLedgerHash - unit ledger hash.
   * @param {UnitTreeCertificate} unitTreeCertificate - unit tree certificate.
   * @param {StateTreeCertificate} stateTreeCertificate - state tree certificate.
   * @param {UnicityCertificate} unicityCertificate - unicity certificate.
   */
  public constructor(
    public readonly version: bigint,
    public readonly unitId: IUnitId,
    public readonly unitValue: bigint,
    private readonly _unitLedgerHash: Uint8Array,
    public readonly unitTreeCertificate: UnitTreeCertificate,
    public readonly stateTreeCertificate: StateTreeCertificate,
    public readonly unicityCertificate: UnicityCertificate,
  ) {
    this.version = BigInt(this.version);
    this.unitValue = BigInt(unitValue);
    this._unitLedgerHash = new Uint8Array(this._unitLedgerHash);
  }

  /**
   * Get unit ledger hash.
   * @returns {Uint8Array} unit ledger hash.
   */
  public get unitLedgerHash(): Uint8Array {
    return new Uint8Array(this._unitLedgerHash);
  }

  public static create(data: IStateProofDto): StateProof {
    return new StateProof(
      BigInt(data.version),
      UnitId.fromBytes(Base16Converter.decode(data.unitId)),
      BigInt(data.unitValue),
      Base16Converter.decode(data.unitLedgerHash),
      UnitTreeCertificate.create(data.unitTreeCert),
      StateTreeCertificate.create(data.stateTreeCert),
      UnicityCertificate.fromCbor(Base16Converter.decode(data.unicityCert)),
    );
  }
}

/**
 * Unit tree certificate.
 */
export class UnitTreeCertificate {
  /**
   * Unit tree certificate constructor.
   * @param {Uint8Array} _transactionRecordHash - transaction record hash.
   * @param {Uint8Array} _unitDataHash - unit data hash.
   * @param {StateProofPathItem[] | null} path - path.
   */
  public constructor(
    private readonly _transactionRecordHash: Uint8Array,
    private readonly _unitDataHash: Uint8Array,
    public readonly path: readonly StateProofPathItem[] | null,
  ) {
    this._transactionRecordHash = new Uint8Array(this._transactionRecordHash);
    this._unitDataHash = new Uint8Array(this._unitDataHash);
    this.path = this.path ? Object.freeze(Array.from(this.path)) : null;
  }

  /**
   * Get transaction record hash.
   * @returns {Uint8Array} transaction record hash.
   */
  public get transactionRecordHash(): Uint8Array {
    return new Uint8Array(this._transactionRecordHash);
  }

  /**
   * Get unit data hash.
   * @returns {Uint8Array} unit data hash.
   */
  public get unitDataHash(): Uint8Array {
    return new Uint8Array(this._unitDataHash);
  }

  /**
   * Create unit tree certificate from dto.
   * @param {IUnitTreeCertificateDto} data
   * @returns {UnitTreeCertificate}
   */
  public static create(data: IUnitTreeCertificateDto): UnitTreeCertificate {
    return new UnitTreeCertificate(
      Base16Converter.decode(data.txrHash),
      Base16Converter.decode(data.dataHash),
      data.path?.map((data) => StateProofPathItem.create(data)) || null,
    );
  }
}

/**
 * State proof path item.
 */
export class StateProofPathItem {
  /**
   * State proof path item constructor.
   * @param {boolean} left - // Direction from parent node. True - left from parent, False - right from parent.
   * @param {Uint8Array} _hash - hash.
   */
  public constructor(
    public readonly left: boolean,
    private readonly _hash: Uint8Array,
  ) {
    this._hash = new Uint8Array(this._hash);
  }

  /**
   * Get hash.
   * @returns {Uint8Array} hash.
   */
  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }

  /**
   * Create state proof path item from dto.
   * @param {IPathItemDto} data
   * @returns {StateProofPathItem}
   */
  public static create(data: IPathItemDto): StateProofPathItem {
    return new StateProofPathItem(data.directionLeft, Base16Converter.decode(data.hash));
  }
}

/**
 * State tree certificate.
 */
export class StateTreeCertificate {
  /**
   * State tree certificate constructor.
   * @param {Uint8Array} _leftSummaryHash - left summary hash.
   * @param {bigint} leftSummaryValue - left summary value.
   * @param {Uint8Array} _rightSummaryHash - right summary hash.
   * @param {bigint} rightSummaryValue - right summary value.
   * @param {StateTreePathItem[] | null} path - path.
   */
  public constructor(
    private readonly _leftSummaryHash: Uint8Array,
    public readonly leftSummaryValue: bigint,
    private readonly _rightSummaryHash: Uint8Array,
    public readonly rightSummaryValue: bigint,
    public readonly path: readonly StateTreePathItem[] | null,
  ) {
    this._leftSummaryHash = new Uint8Array(this._leftSummaryHash);
    this.leftSummaryValue = BigInt(this.leftSummaryValue);
    this._rightSummaryHash = new Uint8Array(this._rightSummaryHash);
    this.rightSummaryValue = BigInt(this.rightSummaryValue);
    this.path = this.path ? Object.freeze(Array.from(this.path)) : null;
  }

  /**
   * Get left summary hash.
   * @returns {Uint8Array} left summary hash.
   */
  public get leftSummaryHash(): Uint8Array {
    return new Uint8Array(this._leftSummaryHash);
  }

  /**
   * Get right summary hash.
   * @returns {Uint8Array} right summary hash.
   */
  public get rightSummaryHash(): Uint8Array {
    return new Uint8Array(this._rightSummaryHash);
  }

  /**
   * Create state tree certificate from dto.
   * @param {IStateTreeCertificateDto} data
   * @returns {StateTreeCertificate}
   */
  public static create(data: IStateTreeCertificateDto): StateTreeCertificate {
    return new StateTreeCertificate(
      Base16Converter.decode(data.leftSummaryHash),
      BigInt(data.leftSummaryValue),
      Base16Converter.decode(data.rightSummaryHash),
      BigInt(data.rightSummaryValue),
      data.path?.map((data) => StateTreePathItem.create(data)) ?? null,
    );
  }
}

export class StateTreePathItem {
  /**
   * State tree path item constructor.
   * @param {IUnitId} unitId - unit identifier.
   * @param {Uint8Array} _logsHash - logs hash.
   * @param {bigint} value - value.
   * @param {Uint8Array} _siblingSummaryHash - sibling summary hash.
   * @param {bigint} siblingSummaryValue - sibling summary value.
   */
  public constructor(
    public readonly unitId: IUnitId,
    private readonly _logsHash: Uint8Array,
    public readonly value: bigint,
    private readonly _siblingSummaryHash: Uint8Array,
    public readonly siblingSummaryValue: bigint,
  ) {
    this._logsHash = new Uint8Array(this._logsHash);
    this.value = BigInt(this.value);
    this._siblingSummaryHash = new Uint8Array(this._siblingSummaryHash);
  }

  /**
   * Get logs hash.
   * @returns {Uint8Array} logs hash.
   */
  public get logsHash(): Uint8Array {
    return new Uint8Array(this._logsHash);
  }

  /**
   * Get sibling summary hash.
   * @returns {Uint8Array} sibling summary hash.
   */
  public get siblingSummaryHash(): Uint8Array {
    return new Uint8Array(this._siblingSummaryHash);
  }

  /**
   * Create state tree path item from dto.
   * @param {IStateTreePathItemDto} data
   * @returns {StateTreePathItem}
   */
  public static create(data: IStateTreePathItemDto): StateTreePathItem {
    return new StateTreePathItem(
      UnitId.fromBytes(Base16Converter.decode(data.unitId)),
      Base16Converter.decode(data.logsHash),
      BigInt(data.value),
      Base16Converter.decode(data.siblingSummaryHash),
      BigInt(data.siblingSummaryValue),
    );
  }
}
