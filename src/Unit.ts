import { IStateProof } from './IStateProof.js';
import { IUnitId } from './IUnitId.js';

export class Unit {
  /**
   * Bill constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {number} networkIdentifier Network ID.
   * @param {number} partitionIdentifier Partition ID.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly networkIdentifier: number,
    public readonly partitionIdentifier: number,
    public readonly stateProof: IStateProof | null
  ) {}
}
