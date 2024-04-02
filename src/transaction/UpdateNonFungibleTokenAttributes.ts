import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { INonFungibleTokenData } from './INonFungibleTokenData.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { NonFungibleTokenData } from './NonFungibleTokenData.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type UpdateNonFungibleTokenAttributesArray = readonly [Uint8Array, Uint8Array, Uint8Array[] | null];

@PayloadAttribute
export class UpdateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'updateNToken';
  }

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
        Backlink: ${Base16Converter.Encode(this.backlink)}
        Data Update Signatures: ${this.dataUpdateSignatures?.map((signature) => Base16Converter.Encode(signature))}`;
  }

  public static FromArray(data: UpdateNonFungibleTokenAttributesArray): UpdateNonFungibleTokenAttributes {
    return new UpdateNonFungibleTokenAttributes(
      NonFungibleTokenData.CreateFromBytes(data[0]),
      new Uint8Array(data[1]),
      data[2]?.map((signature) => new Uint8Array(signature)) || null,
    );
  }
}
