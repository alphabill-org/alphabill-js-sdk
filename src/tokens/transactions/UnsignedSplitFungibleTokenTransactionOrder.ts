import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { TypeOwnerProofsAuthProof } from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { SplitFungibleTokenAttributes } from '../attributes/SplitFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { SplitFungibleTokenTransactionOrder } from './SplitFungibleTokenTransactionOrder.js';

interface ISplitFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
  ownerPredicate: IPredicate;
  amount: bigint;
  type: { unitId: IUnitId };
}

export class UnsignedSplitFungibleTokenTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<SplitFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ISplitFungibleTokenTransactionData): UnsignedSplitFungibleTokenTransactionOrder {
    return new UnsignedSplitFungibleTokenTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.SplitFungibleToken,
        new SplitFungibleTokenAttributes(data.type.unitId, data.amount, data.ownerPredicate, data.token.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
    tokenTypeOwnerProofs: IProofFactory[],
  ): SplitFungibleTokenTransactionOrder {
    const authProofBytes: Uint8Array[] = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const authProof = CborEncoder.encodeArray(authProofBytes);
    const ownerProof = new TypeOwnerProofsAuthProof(
      ownerProofFactory.create(authProof),
      tokenTypeOwnerProofs.map((factory) => factory.create(authProof)),
    );
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([...authProofBytes, ownerProof.encode()])) ?? null;
    return new SplitFungibleTokenTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
