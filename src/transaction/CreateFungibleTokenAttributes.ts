import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes';
import { IPredicate } from './IPredicate';
import { UnitId } from '../UnitId';

export class CreateFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly typeId: UnitId,
    public readonly value: bigint,
    public readonly tokenCreationPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [this.ownerPredicate.getBytes(), this.typeId, this.value, this.tokenCreationPredicateSignatures];
  }
}
