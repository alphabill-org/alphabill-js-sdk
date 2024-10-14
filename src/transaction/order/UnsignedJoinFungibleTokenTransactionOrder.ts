import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { JoinFungibleTokenAttributes } from '../attribute/JoinFungibleTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TokenTypeOwnerProofsAuthProof } from '../proof/TokenTypeOwnerProofsAuthProof.js';
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
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
    tokenTypeOwnerProofs: (Uint8Array | null)[],
  ): Promise<JoinFungibleTokenTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new JoinFungibleTokenTransactionOrder(
      this.payload,
      new TokenTypeOwnerProofsAuthProof(ownerProof, ownerProofSigner.publicKey, tokenTypeOwnerProofs),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
