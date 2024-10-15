import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { SplitFungibleTokenAttributes } from '../attribute/SplitFungibleTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofSigningService } from '../proof/IProofSigningService.js';
import { TypeOwnerProofsAuthProof } from '../proof/TypeOwnerProofsAuthProof.js';
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
    ownerProofSigner: IProofSigningService,
    feeProofSigner: IProofSigningService,
    tokenTypeOwnerProofs: IProofSigningService[],
  ): Promise<SplitFungibleTokenTransactionOrder> {
    const authProof = [await this.payload.encode(this.codec), this.stateUnlock];
    const authProofBytes = await this.codec.encode(authProof);
    const ownerProof = new TypeOwnerProofsAuthProof(
      await ownerProofSigner.sign(authProofBytes),
      await Promise.all(tokenTypeOwnerProofs.map((signer) => signer.sign(authProofBytes))),
    );
    const feeProof = await feeProofSigner.sign(await this.codec.encode([...authProof, ownerProof.encode()]));
    return new SplitFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
