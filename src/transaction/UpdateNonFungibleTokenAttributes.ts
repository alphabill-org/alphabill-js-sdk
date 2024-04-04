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
    private readonly data: INonFungibleTokenData,
    private readonly backlink: Uint8Array,
    private readonly dataUpdateSignatures: Uint8Array[] | null,
  ) {
    this.backlink = new Uint8Array(backlink);
    this.dataUpdateSignatures = this.dataUpdateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public getData(): INonFungibleTokenData {
    return this.data;
  }

  public getBacklink(): Uint8Array {
    return new Uint8Array(this.backlink);
  }

  public getDataUpdateSignatures(): Uint8Array[] | null {
    return this.dataUpdateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): UpdateNonFungibleTokenAttributesArray {
    return this.toArray();
  }

  public toArray(): UpdateNonFungibleTokenAttributesArray {
    return [this.getData().getBytes(), this.getBacklink(), this.getDataUpdateSignatures()];
  }

  public toString(): string {
    return dedent`
      UpdateNonFungibleTokenAttributes
        Data: ${this.data.toString()}
        Backlink: ${Base16Converter.encode(this.backlink)}
        Data Update Signatures: ${this.dataUpdateSignatures?.map((signature) => Base16Converter.encode(signature))}`;
  }

  public static fromArray(data: UpdateNonFungibleTokenAttributesArray): UpdateNonFungibleTokenAttributes {
    return new UpdateNonFungibleTokenAttributes(NonFungibleTokenData.createFromBytes(data[0]), data[1], data[2]);
  }
}
