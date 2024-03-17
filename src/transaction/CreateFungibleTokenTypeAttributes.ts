import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes';
import { TokenIcon } from './TokenIcon';
import { IPredicate } from './IPredicate';
import { UnitId } from '../UnitId';

export class CreateFungibleTokenTypeAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: UnitId | null,
    public readonly decimalPlaces: number,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenCreationPredicate: IPredicate,
    public readonly invariantPredicate: IPredicate,
    public readonly subTypeCreationPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [
      this.symbol,
      this.name,
      this.icon.toArray(),
      this.parentTypeId || null,
      this.decimalPlaces,
      this.subTypeCreationPredicate.getBytes(),
      this.tokenCreationPredicate.getBytes(),
      this.invariantPredicate.getBytes(),
      this.subTypeCreationPredicateSignatures,
    ];
  }
}
