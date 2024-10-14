import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { BurnFungibleTokenAttributes } from '../attribute/BurnFungibleTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TokenTypeOwnerProofsAuthProof } from '../proof/TokenTypeOwnerProofsAuthProof.js';
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
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
    tokenTypeOwnerProofs: (Uint8Array | null)[],
  ): Promise<BurnFungibleTokenTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = new TokenTypeOwnerProofsAuthProof(
      await ownerProofSigner.sign(ownerProofBytes),
      ownerProofSigner.publicKey,
      tokenTypeOwnerProofs,
    );

    const feeProof = new OwnerProofAuthProof(
      await feeProofSigner.sign(
        await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock, ownerProof]),
      ),
      feeProofSigner.publicKey,
    );

    return new BurnFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
