import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { IUnitId } from '../IUnitId.js';

export class BurnFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly targetTokenId: IUnitId,
    public readonly targetTokenBacklink: Uint8Array,
    public readonly backlink: Uint8Array,
    public readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return [
      this.typeId.getBytes(),
      this.value,
      this.targetTokenId.getBytes(),
      this.targetTokenBacklink,
      this.backlink,
      null,
    ];
  }

  public toArray(): ReadonlyArray<unknown> {
    return [
      this.typeId.getBytes(),
      this.value,
      this.targetTokenId.getBytes(),
      this.targetTokenBacklink,
      this.backlink,
      this.invariantPredicateSignatures,
    ];
  }
}
