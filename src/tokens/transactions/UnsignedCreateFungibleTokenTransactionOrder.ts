import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { CreateFungibleTokenAttributes } from '../attributes/CreateFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { TokenPartitionUnitType } from '../TokenPartitionUnitType.js';
import { TokenUnitId } from '../TokenUnitId.js';
import { CreateFungibleTokenTransactionOrder } from './CreateFungibleTokenTransactionOrder.js';

interface ICreateFungibleTokenTransactionData extends ITransactionData {
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
  value: bigint;
  nonce: bigint;
}

export class UnsignedCreateFungibleTokenTransactionOrder {
  private constructor(
    public readonly payload: TransactionPayload<CreateFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static async create(
    data: ICreateFungibleTokenTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedCreateFungibleTokenTransactionOrder> {
    const attributes = new CreateFungibleTokenAttributes(data.ownerPredicate, data.type.unitId, data.value, data.nonce);

    return new UnsignedCreateFungibleTokenTransactionOrder(
      new TransactionPayload(
        data.networkIdentifier,
        SystemIdentifier.TOKEN_PARTITION,
        await TokenUnitId.create(attributes, data.metadata, codec, TokenPartitionUnitType.FUNGIBLE_TOKEN),
        TokenPartitionTransactionType.CreateFungibleToken,
        attributes,
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
      codec,
    );
  }

  public async sign(
    tokenMintingProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
  ): Promise<CreateFungibleTokenTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(
      await tokenMintingProofFactory.create(await this.codec.encode(authProof)),
    );
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new CreateFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
