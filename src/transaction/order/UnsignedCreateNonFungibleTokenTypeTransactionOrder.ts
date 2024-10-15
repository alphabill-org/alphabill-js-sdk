import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { CreateNonFungibleTokenTypeAttributes } from '../attribute/CreateNonFungibleTokenTypeAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { SubTypeOwnerProofsAuthProof } from '../proof/SubTypeOwnerProofsAuthProof.js';
import { TokenIcon } from '../TokenIcon.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { CreateNonFungibleTokenTypeTransactionOrder } from './types/CreateNonFungibleTokenTypeTransactionOrder.js';

interface ICreateNonFungibleTokenTypeTransactionData extends ITransactionData {
  type: { unitId: IUnitId };
  symbol: string;
  name: string;
  icon: { type: string; data: Uint8Array };
  parentTypeId: IUnitId | null;
  subTypeCreationPredicate: IPredicate;
  tokenMintingPredicate: IPredicate;
  tokenTypeOwnerPredicate: IPredicate;
  dataUpdatePredicate: IPredicate;
}

export class UnsignedCreateNonFungibleTokenTypeTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<CreateNonFungibleTokenTypeAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ICreateNonFungibleTokenTypeTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedCreateNonFungibleTokenTypeTransactionOrder> {
    return Promise.resolve(
      new UnsignedCreateNonFungibleTokenTypeTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.type.unitId,
          TokenPartitionTransactionType.CreateNonFungibleTokenType,
          new CreateNonFungibleTokenTypeAttributes(
            data.symbol,
            data.name,
            new TokenIcon(data.icon.type, data.icon.data),
            data.parentTypeId,
            data.subTypeCreationPredicate,
            data.tokenMintingPredicate,
            data.tokenTypeOwnerPredicate,
            data.dataUpdatePredicate,
          ),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  public async sign(
    feeProofFactory: IProofFactory | null,
    subTypeCreationProofs: IProofFactory[],
  ): Promise<CreateNonFungibleTokenTypeTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const authProofBytes = await this.codec.encode(authProof);
    const ownerProof = new SubTypeOwnerProofsAuthProof(
      await Promise.all(
        subTypeCreationProofs.map((factory) =>
          factory.create(authProofBytes).then((proof) => this.codec.encode(proof)),
        ),
      ),
    );
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new CreateNonFungibleTokenTypeTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
