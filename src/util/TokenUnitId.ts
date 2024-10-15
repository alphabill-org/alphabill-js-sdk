import { numberToBytesBE } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionClientMetadata } from '../transaction/ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { TokenPartitionUnitType } from '../transaction/TokenPartitionUnitType.js';
import { UnitIdWithType } from '../transaction/UnitIdWithType.js';

export class TokenUnitId {
  public static async create(
    attributes: ITransactionPayloadAttributes,
    metadata: ITransactionClientMetadata,
    codec: ICborCodec,
    type: TokenPartitionUnitType.FUNGIBLE_TOKEN | TokenPartitionUnitType.NON_FUNGIBLE_TOKEN,
  ): Promise<IUnitId> {
    const attributesBytes = await codec.encode(await attributes.encode(codec));
    const metadataBytes = [
      numberToBytesBE(metadata.timeout, 8),
      numberToBytesBE(metadata.maxTransactionFee, 8),
      metadata.feeCreditRecordId != null ? metadata.feeCreditRecordId.bytes : null,
      metadata.referenceNumber != null ? metadata.referenceNumber : null,
    ];
    const unitIdCbor = await codec.encode([attributesBytes, metadataBytes]);
    const identifier = sha256.create().update(unitIdCbor).digest();
    return new UnitIdWithType(identifier, type);
  }
}
