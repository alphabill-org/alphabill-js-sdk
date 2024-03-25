import { TransactionPayload } from './TransactionPayload.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { TransferNonFungibleTokenAttributes } from './TransferNonFungibleTokenAttributes.js';
import { IUnitId } from '../IUnitId.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';

export class TransferNonFungibleTokenPayload extends TransactionPayload<TransferNonFungibleTokenAttributes> {
  public static readonly PAYLOAD_TYPE = 'transNToken';

  public constructor(
    unitId: IUnitId,
    attributes: TransferNonFungibleTokenAttributes,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(
      TransferNonFungibleTokenPayload.PAYLOAD_TYPE,
      SystemIdentifier.TOKEN_PARTITION,
      unitId,
      attributes,
      clientMetadata,
    );
  }
}
