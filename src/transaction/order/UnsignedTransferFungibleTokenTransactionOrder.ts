import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { TransferFungibleTokenAttributes } from '../attribute/TransferFungibleTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TokenTypeOwnerProofsAuthProof } from '../proof/TokenTypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { TransferFungibleTokenTransactionOrder } from './types/TransferFungibleTokenTransactionOrder.js';

interface ITransferFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint; value: bigint };
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
}

export class UnsignedTransferFungibleTokenTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<TransferFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ITransferFungibleTokenTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedTransferFungibleTokenTransactionOrder> {
    return Promise.resolve(
      new UnsignedTransferFungibleTokenTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.token.unitId,
          TokenPartitionTransactionType.TransferFungibleToken,
          new TransferFungibleTokenAttributes(
            data.ownerPredicate,
            data.token.value,
            data.token.counter,
            data.type.unitId,
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
  ): Promise<TransferFungibleTokenTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new TransferFungibleTokenTransactionOrder(
      this.payload,
      new TokenTypeOwnerProofsAuthProof(ownerProof, ownerProofSigner.publicKey, tokenTypeOwnerProofs),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
