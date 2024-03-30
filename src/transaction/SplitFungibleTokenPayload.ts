import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { SplitFungibleTokenAttributes } from './SplitFungibleTokenAttributes.js';
import { TransactionPayload } from './TransactionPayload.js';

export class SplitFungibleTokenPayload extends TransactionPayload<SplitFungibleTokenAttributes> {
  public static readonly PAYLOAD_TYPE = 'splitFToken';

  public constructor(
    attributes: SplitFungibleTokenAttributes,
    unitId: IUnitId,
    clientMetadata: ITransactionClientMetadata,
  ) {
    super(SplitFungibleTokenPayload.PAYLOAD_TYPE, SystemIdentifier.TOKEN_PARTITION, unitId, attributes, clientMetadata);
  }
}
