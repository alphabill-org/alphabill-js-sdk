import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { TypeOwnerProofsAuthProof } from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { TransferFungibleTokenAttributes } from '../attributes/TransferFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { TransferFungibleTokenTransactionOrder } from './TransferFungibleTokenTransactionOrder.js';

interface ITransferFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint; value: bigint };
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
}

export class UnsignedTransferFungibleTokenTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<TransferFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ITransferFungibleTokenTransactionData): UnsignedTransferFungibleTokenTransactionOrder {
    return new UnsignedTransferFungibleTokenTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.TransferFungibleToken,
        new TransferFungibleTokenAttributes(
          data.type.unitId,
          data.token.value,
          data.ownerPredicate,
          data.token.counter,
        ),
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
  ): TransferFungibleTokenTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new TypeOwnerProofsAuthProof(
      ownerProofFactory.create(authProof),
      tokenTypeOwnerProofs.map((factory) => factory.create(authProof)),
    );
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([authProof, ownerProof.encode()])) ?? null;
    return new TransferFungibleTokenTransactionOrder(
      this.version,
      this.payload,
      ownerProof,
      feeProof,
      this.stateUnlock,
    );
  }
}
