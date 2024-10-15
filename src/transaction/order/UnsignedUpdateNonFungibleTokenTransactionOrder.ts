import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { UpdateNonFungibleTokenAttributes } from '../attribute/UpdateNonFungibleTokenAttributes.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { TypeDataUpdateProofsAuthProof } from '../proof/TypeDataUpdateProofsAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { UpdateNonFungibleTokenTransactionOrder } from './types/UpdateNonFungibleTokenTransactionOrder.js';

interface IUpdateNonFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
  data: INonFungibleTokenData;
}

export class UnsignedUpdateNonFungibleTokenTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<UpdateNonFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: IUpdateNonFungibleTokenTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedUpdateNonFungibleTokenTransactionOrder> {
    return Promise.resolve(
      new UnsignedUpdateNonFungibleTokenTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.token.unitId,
          TokenPartitionTransactionType.UpdateNonFungibleToken,
          new UpdateNonFungibleTokenAttributes(data.data, data.token.counter),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  public async sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
    tokenTypeDataUpdateProofs: IProofFactory[],
  ): Promise<UpdateNonFungibleTokenTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const authProofBytes = await this.codec.encode(authProof);
    const ownerProof = new TypeDataUpdateProofsAuthProof(
      await ownerProofFactory.create(await this.codec.encode(authProofBytes)),
      await Promise.all(tokenTypeDataUpdateProofs.map((factory) => factory.create(authProofBytes))),
    );
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new UpdateNonFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
