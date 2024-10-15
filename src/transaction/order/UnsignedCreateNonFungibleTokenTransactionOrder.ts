import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { TokenUnitId } from '../../util/TokenUnitId.js';
import { CreateNonFungibleTokenAttributes } from '../attribute/CreateNonFungibleTokenAttributes.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofSigningService } from '../proof/IProofSigningService.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TokenPartitionUnitType } from '../TokenPartitionUnitType.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { CreateNonFungibleTokenTransactionOrder } from './types/CreateNonFungibleTokenTransactionOrder.js';

interface ICreateNonFungibleTokenTransactionData extends ITransactionData {
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
  name: string;
  uri: string;
  data: INonFungibleTokenData;
  dataUpdatePredicate: IPredicate;
  nonce: bigint;
}

export class UnsignedCreateNonFungibleTokenTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<CreateNonFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static async create(
    data: ICreateNonFungibleTokenTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedCreateNonFungibleTokenTransactionOrder> {
    const attributes = new CreateNonFungibleTokenAttributes(
      data.ownerPredicate,
      data.type.unitId,
      data.name,
      data.uri,
      data.data,
      data.dataUpdatePredicate,
      data.nonce,
    );

    return new UnsignedCreateNonFungibleTokenTransactionOrder(
      new TransactionPayload(
        data.networkIdentifier,
        SystemIdentifier.TOKEN_PARTITION,
        await TokenUnitId.create(attributes, data.metadata, codec, TokenPartitionUnitType.NON_FUNGIBLE_TOKEN),
        TokenPartitionTransactionType.CreateNonFungibleToken,
        attributes,
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
      codec,
    );
  }

  public async sign(
    ownerProofSigner: IProofSigningService,
    feeProofSigner: IProofSigningService,
  ): Promise<CreateNonFungibleTokenTransactionOrder> {
    const ownerProof = new OwnerProofAuthProof(
      await ownerProofSigner.sign(await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock])),
    );
    const feeProof = await feeProofSigner.sign(
      await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock, ownerProof.encode()]),
    );
    return new CreateNonFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
