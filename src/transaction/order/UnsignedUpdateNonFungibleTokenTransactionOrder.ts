import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { UpdateNonFungibleTokenAttributes } from '../attribute/UpdateNonFungibleTokenAttributes.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TokenTypeDataUpdateProofsAuthProof } from '../proof/TokenTypeDataUpdateProofsAuthProof.js';
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
          TokenPartitionTransactionType.LockToken,
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
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
    tokenTypeDataUpdateProofs: (Uint8Array | null)[],
  ): Promise<UpdateNonFungibleTokenTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new UpdateNonFungibleTokenTransactionOrder(
      this.payload,
      new TokenTypeDataUpdateProofsAuthProof(ownerProof, ownerProofSigner.publicKey, tokenTypeDataUpdateProofs),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
