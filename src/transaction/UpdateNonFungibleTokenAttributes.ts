import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { INonFungibleTokenData } from './INonFungibleTokenData.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { NonFungibleTokenData } from './NonFungibleTokenData.js';
import { PayloadType } from './PayloadAttributeFactory.js';

export type UpdateNonFungibleTokenAttributesArray = readonly [Uint8Array, Uint8Array, Uint8Array[] | null];

export class UpdateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly data: INonFungibleTokenData,
    private readonly _backlink: Uint8Array,
    private readonly _dataUpdateSignatures: Uint8Array[] | null,
  ) {
    this._backlink = new Uint8Array(_backlink);
    this._dataUpdateSignatures = this._dataUpdateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public get payloadType(): PayloadType {
    return PayloadType.UpdateNonFungibleTokenAttributes;
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public get dataUpdateSignatures(): Uint8Array[] | null {
    return this._dataUpdateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  public toOwnerProofData(): UpdateNonFungibleTokenAttributesArray {
    return this.toArray();
  }

  public toArray(): UpdateNonFungibleTokenAttributesArray {
    return [this.data.bytes, this.backlink, this.dataUpdateSignatures];
  }

  public toString(): string {
    return dedent`
      UpdateNonFungibleTokenAttributes
        Data: ${this.data.toString()}
        Backlink: ${Base16Converter.encode(this._backlink)}
        Data Update Signatures: ${this._dataUpdateSignatures?.map((signature) => Base16Converter.encode(signature))}`;
  }

  public static fromArray(data: UpdateNonFungibleTokenAttributesArray): UpdateNonFungibleTokenAttributes {
    return new UpdateNonFungibleTokenAttributes(NonFungibleTokenData.createFromBytes(data[0]), data[1], data[2]);
  }
}
