import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../codec/cbor/CborEncoder.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionClientMetadata } from '../transaction/ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { UnitIdWithType } from '../transaction/UnitIdWithType.js';

export class TokenUnitId {
  public static create(
    attributes: ITransactionPayloadAttributes,
    metadata: ITransactionClientMetadata,
    type: Uint8Array,
  ): IUnitId {
    const unitIdCbor = CborEncoder.encodeArray([attributes.encode(), metadata.encode()]);
    const identifier = sha256.create().update(unitIdCbor).digest();
    return new UnitIdWithType(identifier, type);
  }
}
