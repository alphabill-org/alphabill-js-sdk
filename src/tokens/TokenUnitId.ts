import { sha256 } from '@noble/hashes/sha256';
import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionClientMetadata } from '../transaction/ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { UnitIdWithType } from '../transaction/UnitIdWithType.js';

export class TokenUnitId {
  public static async create(
    attributes: ITransactionPayloadAttributes,
    metadata: ITransactionClientMetadata,
    codec: ICborCodec,
    type: Uint8Array,
  ): Promise<IUnitId> {
    const unitIdCbor = await codec.encode([
      await attributes.encode(codec),
      [
        metadata.timeout,
        metadata.maxTransactionFee,
        metadata.feeCreditRecordId?.bytes ?? null,
        metadata.referenceNumber ?? null,
      ],
    ]);

    const identifier = sha256.create().update(unitIdCbor).digest();
    return new UnitIdWithType(identifier, type);
  }
}
