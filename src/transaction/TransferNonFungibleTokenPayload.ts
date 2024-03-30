import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { TransactionPayload } from './TransactionPayload.js';
import { TransferNonFungibleTokenAttributes } from './TransferNonFungibleTokenAttributes.js';

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
