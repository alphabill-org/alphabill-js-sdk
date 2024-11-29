import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { TypeOwnerProofsAuthProof } from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { JoinFungibleTokenAttributes } from '../attributes/JoinFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { BurnFungibleTokenTransactionRecordWithProof } from './BurnFungibleTokenTransactionRecordWithProof.js';
import { JoinFungibleTokenTransactionOrder } from './JoinFungibleTokenTransactionOrder.js';

interface IJoinFungibleTokensTransactionData extends ITransactionData {
  token: { unitId: IUnitId };
  proofs: BurnFungibleTokenTransactionRecordWithProof[];
}

export class UnsignedJoinFungibleTokenTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<JoinFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: IJoinFungibleTokensTransactionData): UnsignedJoinFungibleTokenTransactionOrder {
    return new UnsignedJoinFungibleTokenTransactionOrder(
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.JoinFungibleToken,
        new JoinFungibleTokenAttributes(data.proofs),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory,
    tokenTypeOwnerProofs: IProofFactory[],
  ): JoinFungibleTokenTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new TypeOwnerProofsAuthProof(
      ownerProofFactory.create(authProof),
      tokenTypeOwnerProofs.map((factory) => factory.create(authProof)),
    );
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([authProof, ownerProof.encode()])) ?? null;
    return new JoinFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
