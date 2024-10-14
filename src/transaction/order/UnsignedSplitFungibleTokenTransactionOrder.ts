import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { SplitFungibleTokenAttributes } from '../attribute/SplitFungibleTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TokenTypeOwnerProofsAuthProof } from '../proof/TokenTypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { SplitFungibleTokenTransactionOrder } from './types/SplitFungibleTokenTransactionOrder.js';

interface ISplitFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
  ownerPredicate: IPredicate;
  amount: bigint;
  type: { unitId: IUnitId };
}

export class UnsignedSplitFungibleTokenTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<SplitFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ISplitFungibleTokenTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedSplitFungibleTokenTransactionOrder> {
    return Promise.resolve(
      new UnsignedSplitFungibleTokenTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.token.unitId,
          TokenPartitionTransactionType.SplitFungibleToken,
          new SplitFungibleTokenAttributes(data.ownerPredicate, data.amount, data.token.counter, data.type.unitId),
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
  ): Promise<SplitFungibleTokenTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new SplitFungibleTokenTransactionOrder(
      this.payload,
      new TokenTypeOwnerProofsAuthProof(ownerProof, ownerProofSigner.publicKey, tokenTypeOwnerProofs),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
