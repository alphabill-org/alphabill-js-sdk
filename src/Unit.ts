import { IUnitId } from './IUnitId.js';
import { StateProof } from './unit/StateProof.js';

export class Unit {
  /**
   * Unit constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {number} networkIdentifier Network ID.
   * @param {number} partitionIdentifier Partition ID.
   * @param {StateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly networkIdentifier: number,
    public readonly partitionIdentifier: number,
    public readonly stateProof: StateProof | null,
  ) {}
}
