import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';
import { TransferFungibleTokenAttributes } from './TransferFungibleTokenAttributes.js';

export class TransferFungibleTokenPayload extends TransactionPayload<TransferFungibleTokenAttributes> {
  public static readonly PAYLOAD_TYPE = 'transFToken';

  public constructor(
    unitId: IUnitId,
    attributes: TransferFungibleTokenAttributes,
    clientMetadata: ITransactionClientMetadata,
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
