import { INonFungibleTokenData } from './INonFungibleTokenData.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { IPredicate } from './IPredicate.js';
import { IUnitId } from '../IUnitId.js';

export class CreateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly typeId: IUnitId,
    public readonly name: string,
    public readonly uri: string,
    public readonly data: INonFungibleTokenData,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly tokenCreationPredicateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [
      this.ownerPredicate.getBytes(),
      this.typeId.getBytes(),
      this.name,
      this.uri,
      this.data.getBytes(),
      this.dataUpdatePredicate.getBytes(),
      this.tokenCreationPredicateSignatures,
    ];
  }
}
