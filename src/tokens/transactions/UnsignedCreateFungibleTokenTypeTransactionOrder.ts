import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { SubTypeOwnerProofsAuthProof } from '../../transaction/proofs/SubTypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { CreateFungibleTokenTypeAttributes } from '../attributes/CreateFungibleTokenTypeAttributes.js';
import { TokenIcon } from '../TokenIcon.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { CreateFungibleTokenTypeTransactionOrder } from './CreateFungibleTokenTypeTransactionOrder.js';

interface ICreateFungibleTokenTypeTransactionData extends ITransactionData {
  type: { unitId: IUnitId };
  symbol: string;
  name: string;
  icon: { type: string; data: Uint8Array };
  parentTypeId: IUnitId | null;
  decimalPlaces: number;
  subTypeCreationPredicate: IPredicate;
  tokenMintingPredicate: IPredicate;
  tokenTypeOwnerPredicate: IPredicate;
}

export class UnsignedCreateFungibleTokenTypeTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<CreateFungibleTokenTypeAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ICreateFungibleTokenTypeTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedCreateFungibleTokenTypeTransactionOrder> {
    return Promise.resolve(
      new UnsignedCreateFungibleTokenTypeTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.type.unitId,
          TokenPartitionTransactionType.CreateFungibleTokenType,
          new CreateFungibleTokenTypeAttributes(
            data.symbol,
            data.name,
            new TokenIcon(data.icon.type, data.icon.data),
            data.parentTypeId,
            data.decimalPlaces,
            data.subTypeCreationPredicate,
            data.tokenMintingPredicate,
            data.tokenTypeOwnerPredicate,
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
  ): Promise<CreateFungibleTokenTypeTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const authProofBytes = await this.codec.encode(authProof);
    const ownerProof = new SubTypeOwnerProofsAuthProof(
      await Promise.all(subTypeCreationProofs.map((factory) => factory.create(authProofBytes))),
    );
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new CreateFungibleTokenTypeTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
