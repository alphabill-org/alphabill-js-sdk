import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { CreateFungibleTokenTypeAttributes } from '../attribute/CreateFungibleTokenTypeAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { SubTypeOwnerProofsAuthProof } from '../proof/SubTypeOwnerProofsAuthProof.js';
import { TokenIcon } from '../TokenIcon.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { CreateFungibleTokenTypeTransactionOrder } from './types/CreateFungibleTokenTypeTransactionOrder.js';

interface ICreateFungibleTokenTypeTransactionData extends ITransactionData {
  type: { unitId: IUnitId };
  symbol: string;
  name: string;
  icon: { type: string; data: Uint8Array };
  parentTypeId: IUnitId | null;
  decimalPlaces: number;
  subTypeCreationPredicate: IPredicate;
  tokenCreationPredicate: IPredicate;
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
            data.tokenCreationPredicate,
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
      await Promise.all(
        subTypeCreationProofs.map((factory) =>
          factory.create(authProofBytes).then((proof) => this.codec.encode(proof)),
        ),
      ),
    );
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new CreateFungibleTokenTypeTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
