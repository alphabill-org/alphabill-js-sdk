import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { TypeOwnerProofsAuthProof } from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { TransferNonFungibleTokenAttributes } from '../attributes/TransferNonFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { TransferNonFungibleTokenTransactionOrder } from './TransferNonFungibleTokenTransactionOrder.js';

interface ITransferNonFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
  ownerPredicate: IPredicate;
  nonce: Uint8Array | null;
  counter: bigint;
  type: { unitId: IUnitId };
}

export class UnsignedTransferNonFungibletokenTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<TransferNonFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(
    data: ITransferNonFungibleTokenTransactionData,
  ): UnsignedTransferNonFungibletokenTransactionOrder {
    return new UnsignedTransferNonFungibletokenTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.TransferNonFungibleToken,
        new TransferNonFungibleTokenAttributes(data.type.unitId, data.ownerPredicate, data.token.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public async sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
    tokenTypeOwnerProofs: IProofFactory[],
  ): Promise<TransferNonFungibleTokenTransactionOrder> {
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
    return new TransferNonFungibleTokenTransactionOrder(
      this.version,
      this.payload,
      this.stateUnlock,
      ownerProof,
      feeProof,
    );
  }
}
