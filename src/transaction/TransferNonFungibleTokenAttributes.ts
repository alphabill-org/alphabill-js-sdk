import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { IPredicate } from './IPredicate.js';
import { IUnitId } from '../IUnitId.js';

export class TransferNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly nonce: Uint8Array | null,
    public readonly backlink: Uint8Array,
    public readonly typeId: IUnitId,
    public readonly invariantPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return [this.ownerPredicate.getBytes(), this.nonce, this.backlink, this.typeId.getBytes(), null];
  }

  public toArray(): ReadonlyArray<unknown> {
    return [
      this.ownerPredicate.getBytes(),
      this.nonce,
      this.backlink,
      this.typeId.getBytes(),
      this.invariantPredicateSignatures,
    ];
  }
}
