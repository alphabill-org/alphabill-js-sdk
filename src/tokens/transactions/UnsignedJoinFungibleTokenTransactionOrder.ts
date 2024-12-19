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
import { JoinFungibleTokenTransactionOrder } from './JoinFungibleTokenTransactionOrder.js';
import { BurnFungibleTokenTransactionRecordWithProof } from './records/BurnFungibleTokenTransactionRecordWithProof.js';

interface IJoinFungibleTokensTransactionData extends ITransactionData {
  token: { unitId: IUnitId };
  proofs: BurnFungibleTokenTransactionRecordWithProof[];
}

export class UnsignedJoinFungibleTokenTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<JoinFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: IJoinFungibleTokensTransactionData): UnsignedJoinFungibleTokenTransactionOrder {
    return new UnsignedJoinFungibleTokenTransactionOrder(
      data.version,
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

  public async sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory,
    tokenTypeOwnerProofs: IProofFactory[],
  ): Promise<JoinFungibleTokenTransactionOrder> {
    const authProofBytes: Uint8Array[] = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const authProof = CborEncoder.encodeArray(authProofBytes);
    const ownerProof = new TypeOwnerProofsAuthProof(
      await ownerProofFactory.create(authProof),
      await Promise.all(tokenTypeOwnerProofs.map((factory) => factory.create(authProof))),
    );
    const feeProof =
      (await feeProofFactory?.create(CborEncoder.encodeArray([...authProofBytes, ownerProof.encode()]))) ?? null;
    return new JoinFungibleTokenTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
