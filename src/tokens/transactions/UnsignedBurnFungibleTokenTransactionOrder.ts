import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifiers } from '../../PartitionIdentifiers.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { TypeOwnerProofsAuthProof } from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { BurnFungibleTokenAttributes } from '../attributes/BurnFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { BurnFungibleTokenTransactionOrder } from './BurnFungibleTokenTransactionOrder.js';

interface IBurnFungibleTokenTransactionData extends ITransactionData {
  type: { unitId: IUnitId };
  token: { unitId: IUnitId; counter: bigint; value: bigint };
  targetToken: { unitId: IUnitId; counter: bigint };
}

export class UnsignedBurnFungibleTokenTransactionOrder {
  private constructor(
    public readonly payload: TransactionPayload<BurnFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: IBurnFungibleTokenTransactionData,
    codec: ICborCodec,
  ): UnsignedBurnFungibleTokenTransactionOrder {
    return new UnsignedBurnFungibleTokenTransactionOrder(
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifiers.Token,
        data.token.unitId,
        TokenPartitionTransactionType.BurnFungibleToken,
        new BurnFungibleTokenAttributes(
          data.type.unitId,
          data.token.value,
          data.targetToken.unitId,
          data.targetToken.counter,
          data.token.counter,
        ),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
      codec,
    );
  }

  public async sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
    tokenTypeOwnerProofs: IProofFactory[],
  ): Promise<BurnFungibleTokenTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const authProofBytes = await this.codec.encode(authProof);
    const ownerProof = new TypeOwnerProofsAuthProof(
      await ownerProofFactory.create(authProofBytes),
      await Promise.all(tokenTypeOwnerProofs.map((factory) => factory.create(authProofBytes))),
    );
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new BurnFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
