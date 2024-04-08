import { IPathItem, IStateProof, IStateTreeCert, IStateTreePathItem, IUnit, IUnitTreeCert } from './IUnit.js';
import { IUnitId } from './IUnitId.js';

/**
 * @implements {IUnit}
 */
export class Unit<T> implements IUnit<T> {
  public constructor(
    public readonly unitId: IUnitId,
    public readonly data: T,
    private readonly _ownerPredicate: Uint8Array,
    public readonly stateProof: IStateProof | null,
  ) {
    this._ownerPredicate = new Uint8Array(this._ownerPredicate);
  }

  public get ownerPredicate(): Uint8Array {
    return new Uint8Array(this._ownerPredicate);
  }
}

export class StateProof implements IStateProof {
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

  public get unitLedgerHash(): Uint8Array {
    return new Uint8Array(this._unitLedgerHash);
  }
}

export class UnitTreeCert implements IUnitTreeCert {
  public constructor(
    private readonly _transactionRecordHash: Uint8Array,
    private readonly _unitDataHash: Uint8Array,
    public readonly path: readonly IPathItem[] | null,
  ) {
    this._transactionRecordHash = new Uint8Array(this._transactionRecordHash);
    this._unitDataHash = new Uint8Array(this._unitDataHash);
    this.path = this.path ? Object.freeze(Array.from(this.path)) : null;
  }

  public get transactionRecordHash(): Uint8Array {
    return new Uint8Array(this._transactionRecordHash);
  }

  public get unitDataHash(): Uint8Array {
    return new Uint8Array(this._unitDataHash);
  }
}

export class PathItem implements IPathItem {
  public constructor(
    private readonly _hash: Uint8Array,
    public readonly left: boolean,
  ) {
    this._hash = new Uint8Array(this._hash);
  }

  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }
}

export class StateTreeCert implements IStateTreeCert {
  public constructor(
    private readonly _leftSummaryHash: Uint8Array,
    public readonly leftSummaryValue: bigint,
    private readonly _rightSummaryHash: Uint8Array,
    public readonly rightSummaryValue: bigint,
    public readonly path: readonly IStateTreePathItem[] | null,
  ) {
    this._leftSummaryHash = new Uint8Array(this._leftSummaryHash);
    this._rightSummaryHash = new Uint8Array(this._rightSummaryHash);
    this.path = this.path ? Object.freeze(Array.from(this.path)) : null;
  }

  public get leftSummaryHash(): Uint8Array {
    return new Uint8Array(this._leftSummaryHash);
  }

  public get rightSummaryHash(): Uint8Array {
    return new Uint8Array(this._rightSummaryHash);
  }
}

export class StateTreePathItem implements IStateTreePathItem {
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

  public get logsHash(): Uint8Array {
    return new Uint8Array(this._logsHash);
  }

  public get siblingSummaryHash(): Uint8Array {
    return new Uint8Array(this._siblingSummaryHash);
  }
}
