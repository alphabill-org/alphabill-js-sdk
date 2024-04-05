import { IPathItem, IStateProof, IStateTreeCert, IStateTreePathItem, IUnit, IUnitTreeCert } from './IUnit.js';
import { IUnitId } from './IUnitId.js';

/**
 * @implements {IUnit}
 */
export class Unit<T> implements IUnit<T> {
  public constructor(
    private readonly unitId: IUnitId,
    private readonly data: T,
    private readonly ownerPredicate: Uint8Array,
    private readonly stateProof: IStateProof | null,
  ) {
    this.ownerPredicate = new Uint8Array(this.ownerPredicate);
  }

  public getUnitId(): IUnitId {
    return this.unitId;
  }

  public getData(): T {
    return this.data;
  }

  public getOwnerPredicate(): Uint8Array {
    return new Uint8Array(this.ownerPredicate);
  }

  public getStateProof(): IStateProof | null {
    return this.stateProof;
  }
}

export class StateProof implements IStateProof {
  public constructor(
    private readonly unitId: IUnitId,
    private readonly unitValue: bigint,
    private readonly unitLedgerHash: Uint8Array,
    private readonly unitTreeCert: IUnitTreeCert,
    private readonly stateTreeCert: IStateTreeCert,
    private readonly unicityCertificate: unknown,
  ) {
    this.unitLedgerHash = new Uint8Array(this.unitLedgerHash);
  }

  public getUnitId(): IUnitId {
    return this.unitId;
  }

  public getUnitValue(): bigint {
    return this.unitValue;
  }

  public getUnitLedgerHash(): Uint8Array {
    return new Uint8Array(this.unitLedgerHash);
  }

  public getUnitTreeCert(): IUnitTreeCert {
    return this.unitTreeCert;
  }

  public getStateTreeCert(): IStateTreeCert {
    return this.stateTreeCert;
  }

  public getUnicityCertificate(): unknown {
    return this.unicityCertificate;
  }
}

export class UnitTreeCert implements IUnitTreeCert {
  public constructor(
    private readonly transactionRecordHash: Uint8Array,
    private readonly unitDataHash: Uint8Array,
    private readonly path: readonly IPathItem[] | null,
  ) {
    this.transactionRecordHash = new Uint8Array(this.transactionRecordHash);
    this.unitDataHash = new Uint8Array(this.unitDataHash);
    this.path = this.path ? Object.freeze(Array.from(this.path)) : null;
  }

  public getTransactionRecordHash(): Uint8Array {
    return new Uint8Array(this.transactionRecordHash);
  }

  public getUnitDataHash(): Uint8Array {
    return new Uint8Array(this.unitDataHash);
  }

  public getPath(): readonly IPathItem[] | null {
    return this.path;
  }
}

export class PathItem implements IPathItem {
  public constructor(
    private readonly hash: Uint8Array,
    private readonly directionLeft: boolean,
  ) {
    this.hash = new Uint8Array(this.hash);
  }

  public getHash(): Uint8Array {
    return new Uint8Array(this.hash);
  }

  public isLeft(): boolean {
    return this.directionLeft;
  }
}

export class StateTreeCert implements IStateTreeCert {
  public constructor(
    private readonly leftSummaryHash: Uint8Array,
    private readonly leftSummaryValue: bigint,
    private readonly rightSummaryHash: Uint8Array,
    private readonly rightSummaryValue: bigint,
    private readonly path: readonly IStateTreePathItem[] | null,
  ) {
    this.leftSummaryHash = new Uint8Array(this.leftSummaryHash);
    this.rightSummaryHash = new Uint8Array(this.rightSummaryHash);
    this.path = this.path ? Object.freeze(Array.from(this.path)) : null;
  }

  public getLeftSummaryHash(): Uint8Array {
    return new Uint8Array(this.leftSummaryHash);
  }

  public getLeftSummaryValue(): bigint {
    return this.leftSummaryValue;
  }

  public getRightSummaryHash(): Uint8Array {
    return new Uint8Array(this.rightSummaryHash);
  }

  public getRightSummaryValue(): bigint {
    return this.rightSummaryValue;
  }

  public getPath(): readonly IStateTreePathItem[] | null {
    return this.path;
  }
}

export class StateTreePathItem implements IStateTreePathItem {
  public constructor(
    private readonly unitId: IUnitId,
    private readonly logsHash: Uint8Array,
    private readonly value: bigint,
    private readonly siblingSummaryHash: Uint8Array,
    private readonly siblingSummaryValue: bigint,
  ) {
    this.logsHash = new Uint8Array(this.logsHash);
    this.value = BigInt(this.value);
    this.siblingSummaryHash = new Uint8Array(this.siblingSummaryHash);
  }

  public getUnitId(): IUnitId {
    return this.unitId;
  }

  public getLogsHash(): Uint8Array {
    return new Uint8Array(this.logsHash);
  }

  public getValue(): bigint {
    return this.value;
  }

  public getSiblingSummaryHash(): Uint8Array {
    return new Uint8Array(this.siblingSummaryHash);
  }

  public getSiblingSummaryValue(): bigint {
    return this.siblingSummaryValue;
  }
}
