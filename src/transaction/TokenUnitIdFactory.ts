import { numberToBytesBE } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IUnitId } from '../IUnitId.js';
import { CreateFungibleTokenAttributes } from './CreateFungibleTokenAttributes.js';
import { CreateNonFungibleTokenAttributes } from './CreateNonFungibleTokenAttributes.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { UnitIdWithType } from './UnitIdWithType.js';
import { UnitType } from './UnitType.js';

export class TokenUnitIdFactory {
  public constructor(private readonly cborCodec: ICborCodec) {}

  public async create(
    attributes: CreateFungibleTokenAttributes | CreateNonFungibleTokenAttributes,
    metadata: ITransactionClientMetadata,
    unitType: UnitType,
  ): Promise<IUnitId> {
    const attributesBytes = await this.cborCodec.encode(attributes.toOwnerProofData());
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
    return new UnitIdWithType(unitPart.digest(), unitType);
  }
}
