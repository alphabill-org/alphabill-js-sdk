import { numberToBytesBE } from '@noble/curves/abstract/utils.js';
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
    const unitPart = sha256
      .create()
      .update(attributesBytes)
      .update(numberToBytesBE(metadata.timeout, 8))
      .update(numberToBytesBE(metadata.maxTransactionFee, 8));
    if (metadata.feeCreditRecordId != null) {
      unitPart.update(metadata.feeCreditRecordId.bytes);
    }
    if (metadata.referenceNumber != null) {
      unitPart.update(metadata.referenceNumber);
    }
    return new UnitIdWithType(unitPart.digest(), type);
  }
}
