import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { BurnFungibleTokenAttributes } from '../attribute/BurnFungibleTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { TypeOwnerProofsAuthProof } from '../proof/TypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { BurnFungibleTokenTransactionOrder } from './types/BurnFungibleTokenTransactionOrder.js';

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
  ): Promise<UnsignedBurnFungibleTokenTransactionOrder> {
    return Promise.resolve(
      new UnsignedBurnFungibleTokenTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
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
      ),
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
      await ownerProofFactory.create(await this.codec.encode(authProofBytes)),
      await Promise.all(
        tokenTypeOwnerProofs.map((factory) => factory.create(authProofBytes).then((proof) => this.codec.encode(proof))),
      ),
    );
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new BurnFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
