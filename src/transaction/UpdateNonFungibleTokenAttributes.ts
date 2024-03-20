import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { INonFungibleTokenData } from './INonFungibleTokenData.js';

export class UpdateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly data: INonFungibleTokenData,
    public readonly backlink: Uint8Array,
    public readonly dataUpdateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [this.data.getBytes(), this.backlink, this.dataUpdateSignatures];
  }
}
