import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { JoinFungibleTokenAttributes } from '../attribute/JoinFungibleTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { TypeOwnerProofsAuthProof } from '../proof/TypeOwnerProofsAuthProof.js';
import { BurnFungibleTokenTransactionRecordWithProof } from '../record/BurnFungibleTokenTransactionRecordWithProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { JoinFungibleTokenTransactionOrder } from './types/JoinFungibleTokenTransactionOrder.js';

interface IJoinFungibleTokensTransactionData extends ITransactionData {
  token: { unitId: IUnitId };
  proofs: BurnFungibleTokenTransactionRecordWithProof[];
}

export class UnsignedJoinFungibleTokenTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<JoinFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: IJoinFungibleTokensTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedJoinFungibleTokenTransactionOrder> {
    return Promise.resolve(
      new UnsignedJoinFungibleTokenTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.token.unitId,
          TokenPartitionTransactionType.JoinFungibleToken,
          new JoinFungibleTokenAttributes(data.proofs),
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
    feeProofFactory: IProofFactory,
    tokenTypeOwnerProofs: IProofFactory[],
  ): Promise<JoinFungibleTokenTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const authProofBytes = await this.codec.encode(authProof);
    const ownerProof = new TypeOwnerProofsAuthProof(
      await ownerProofFactory.create(authProofBytes),
      await Promise.all(tokenTypeOwnerProofs.map((factory) => factory.create(authProofBytes))),
    );
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) || null;
    return new JoinFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
