import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { INonFungibleTokenData } from './INonFungibleTokenData.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export type UpdateNonFungibleTokenAttributesArray = readonly [Uint8Array, Uint8Array, Uint8Array[] | null];

export class UpdateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly data: INonFungibleTokenData,
    public readonly backlink: Uint8Array,
    public readonly dataUpdateSignatures: Uint8Array[] | null,
  ) {}

  public toOwnerProofData(): UpdateNonFungibleTokenAttributesArray {
    return this.toArray();
  }

  public toArray(): UpdateNonFungibleTokenAttributesArray {
    return [this.data.getBytes(), this.backlink, this.dataUpdateSignatures];
  }

  public toString(): string {
    return dedent`
      UpdateNonFungibleTokenAttributes
        Data: ${this.data.toString()}
        Backlink: ${Base16Converter.encode(this.backlink)}
        Data Update Signatures: ${this.dataUpdateSignatures?.map((signature) => Base16Converter.encode(signature))}`;
  }
}
