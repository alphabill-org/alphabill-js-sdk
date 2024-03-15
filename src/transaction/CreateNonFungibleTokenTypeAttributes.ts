import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TokenIcon } from './TokenIcon.js';
import { IPredicate } from './IPredicate.js';
import { IUnitId } from '../IUnitId.js';

export class CreateNonFungibleTokenTypeAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenCreationPredicate: IPredicate,
    public readonly invariantPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
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
      this.parentTypeId?.getBytes() || null,
      this.subTypeCreationPredicate.getBytes(),
      this.tokenCreationPredicate.getBytes(),
      this.invariantPredicate.getBytes(),
      this.dataUpdatePredicate.getBytes(),
      this.subTypeCreationPredicateSignatures,
    ];
  }
}
