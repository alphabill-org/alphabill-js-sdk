import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { TransferNonFungibleTokenAttributes } from '../attribute/TransferNonFungibleTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofSigningService } from '../proof/IProofSigningService.js';
import { TypeOwnerProofsAuthProof } from '../proof/TypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { TransferNonFungibleTokenTransactionOrder } from './types/TransferNonFungibleTokenTransactionOrder.js';

interface ITransferNonFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
  ownerPredicate: IPredicate;
  nonce: Uint8Array | null;
  counter: bigint;
  type: { unitId: IUnitId };
}

export class UnsignedTransferNonFungibletokenTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<TransferNonFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ITransferNonFungibleTokenTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedTransferNonFungibletokenTransactionOrder> {
    return Promise.resolve(
      new UnsignedTransferNonFungibletokenTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.token.unitId,
          TokenPartitionTransactionType.TransferNonFungibleToken,
          new TransferNonFungibleTokenAttributes(data.ownerPredicate, data.token.counter, data.type.unitId),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  public async sign(
    ownerProofSigner: IProofSigningService,
    feeProofSigner: IProofSigningService,
    tokenTypeOwnerProofs: IProofSigningService[],
  ): Promise<TransferNonFungibleTokenTransactionOrder> {
    const authProof = [await this.payload.encode(this.codec), this.stateUnlock];
    const authProofBytes = await this.codec.encode(authProof);
    const ownerProof = new TypeOwnerProofsAuthProof(
      await ownerProofSigner.sign(authProofBytes),
      await Promise.all(tokenTypeOwnerProofs.map((signer) => signer.sign(authProofBytes))),
    );
    const feeProof = await feeProofSigner.sign(await this.codec.encode([...authProof, ownerProof.encode()]));
    return new TransferNonFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
