import { IPathItem, IStateProof, IStateTreeCert, IStateTreePathItem, IUnitTreeCert } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';

/**
 * State proof.
 * @implements {IStateProof}
 */
export class StateProof implements IStateProof {
  /**
   * State proof constructor.
   * @param {IUnitId} unitId - unit identifier.
   * @param {bigint} unitValue - unit value.
   * @param {Uint8Array} _unitLedgerHash - unit ledger hash.
   * @param {IUnitTreeCert} unitTreeCert - unit tree certificate.
   * @param {IStateTreeCert} stateTreeCert - state tree certificate.
   * @param {unknown} unicityCertificate - unicity certificate.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly unitValue: bigint,
    private readonly _unitLedgerHash: Uint8Array,
    public readonly unitTreeCert: IUnitTreeCert,
    public readonly stateTreeCert: IStateTreeCert,
    public readonly unicityCertificate: unknown,
  ) {
    this._unitLedgerHash = new Uint8Array(this._unitLedgerHash);
  }

  /**
   * @see {IStateProof.unitLedgerHash}
   */
  public get unitLedgerHash(): Uint8Array {
    return new Uint8Array(this._unitLedgerHash);
  }
}

/**
 * Unit tree certificate.
 * @implements {IUnitTreeCert}
 */
export class UnitTreeCert implements IUnitTreeCert {
  /**
   * Unit tree certificate constructor.
   * @param {Uint8Array} _transactionRecordHash - transaction record hash.
   * @param {Uint8Array} _unitDataHash - unit data hash.
   * @param {IPathItem[] | null} path - path.
   */
  public constructor(
    private readonly _transactionRecordHash: Uint8Array,
    private readonly _unitDataHash: Uint8Array,
    public readonly path: readonly IPathItem[] | null,
  ) {
    this._transactionRecordHash = new Uint8Array(this._transactionRecordHash);
    this._unitDataHash = new Uint8Array(this._unitDataHash);
    this.path = this.path ? Object.freeze(Array.from(this.path)) : null;
  }

  /**
   * @see {IUnitTreeCert.transactionRecordHash}
   */
  public get transactionRecordHash(): Uint8Array {
    return new Uint8Array(this._transactionRecordHash);
  }

  /**
   * @see {IUnitTreeCert.unitDataHash}
   */
  public get unitDataHash(): Uint8Array {
    return new Uint8Array(this._unitDataHash);
  }
}

/**
 * Path item.
 * @implements {IPathItem}
 */
export class PathItem implements IPathItem {
  /**
   * Path item constructor.
   * @param _hash - hash.
   * @param {boolean} left - // Direction from parent node. True - left from parent, False - right from parent.
   */
  public constructor(
    private readonly _hash: Uint8Array,
    public readonly left: boolean,
  ) {
    this._hash = new Uint8Array(this._hash);
  }

  /**
   * @see {IPathItem.hash}
   */
  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }
}

/**
 * State tree certificate.
 * @implements {IStateTreeCert}
 */
export class StateTreeCert implements IStateTreeCert {
  /**
   * State tree certificate constructor.
   * @param {Uint8Array} _leftSummaryHash - left summary hash.
   * @param {bigint} leftSummaryValue - left summary value.
   * @param {Uint8Array} _rightSummaryHash - right summary hash.
   * @param {bigint} rightSummaryValue - right summary value.
   * @param {IStateTreePathItem[] | null} path - path.
   */
  public constructor(
    private readonly _leftSummaryHash: Uint8Array,
    public readonly leftSummaryValue: bigint,
    private readonly _rightSummaryHash: Uint8Array,
    public readonly rightSummaryValue: bigint,
    public readonly path: readonly IStateTreePathItem[] | null,
  ) {
    this._leftSummaryHash = new Uint8Array(this._leftSummaryHash);
    this.leftSummaryValue = BigInt(leftSummaryValue);
    this._rightSummaryHash = new Uint8Array(this._rightSummaryHash);
    this.rightSummaryValue = BigInt(rightSummaryValue);
    this.path = this.path ? Object.freeze(Array.from(this.path)) : null;
  }

  /**
   * @see {IStateTreeCert.leftSummaryHash}
   */
  public get leftSummaryHash(): Uint8Array {
    return new Uint8Array(this._leftSummaryHash);
  }

  /**
   * @see {IStateTreeCert.rightSummaryHash}
   */
  public get rightSummaryHash(): Uint8Array {
    return new Uint8Array(this._rightSummaryHash);
  }
}

export class StateTreePathItem implements IStateTreePathItem {
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
   * @see {IStateTreePathItem.logsHash}
   */
  public get logsHash(): Uint8Array {
    return new Uint8Array(this._logsHash);
  }

  /**
   * @see {IStateTreePathItem.siblingSummaryHash}
   */
  public get siblingSummaryHash(): Uint8Array {
    return new Uint8Array(this._siblingSummaryHash);
  }
}
