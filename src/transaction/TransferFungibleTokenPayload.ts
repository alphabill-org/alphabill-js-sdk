import { TransactionPayload } from './TransactionPayload.js';
import { FeeCreditClientMetadata } from './FeeCreditClientMetadata.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { TransferFungibleTokenAttributes } from './TransferFungibleTokenAttributes.js';
import { IUnitId } from '../IUnitId.js';

export class TransferFungibleTokenPayload extends TransactionPayload<TransferFungibleTokenAttributes> {
  public static readonly PAYLOAD_TYPE = 'transFToken';

  public constructor(
    unitId: IUnitId,
    attributes: TransferFungibleTokenAttributes,
    clientMetadata: FeeCreditClientMetadata,
  ) {
    super(
      TransferFungibleTokenPayload.PAYLOAD_TYPE,
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
