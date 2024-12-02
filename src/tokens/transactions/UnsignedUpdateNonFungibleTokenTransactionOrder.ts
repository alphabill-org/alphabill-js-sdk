import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { TypeDataUpdateProofsAuthProof } from '../../transaction/proofs/TypeDataUpdateProofsAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UpdateNonFungibleTokenAttributes } from '../attributes/UpdateNonFungibleTokenAttributes.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { UpdateNonFungibleTokenTransactionOrder } from './UpdateNonFungibleTokenTransactionOrder.js';

interface IUpdateNonFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
  data: INonFungibleTokenData;
}

export class UnsignedUpdateNonFungibleTokenTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<UpdateNonFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: IUpdateNonFungibleTokenTransactionData): UnsignedUpdateNonFungibleTokenTransactionOrder {
    return new UnsignedUpdateNonFungibleTokenTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.UpdateNonFungibleToken,
        new UpdateNonFungibleTokenAttributes(data.data, data.token.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
    tokenTypeDataUpdateProofs: IProofFactory[],
  ): UpdateNonFungibleTokenTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new TypeDataUpdateProofsAuthProof(
      ownerProofFactory.create(authProof),
      tokenTypeDataUpdateProofs.map((factory) => factory.create(authProof)),
    );
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([authProof, ownerProof.encode()])) ?? null;
    return new UpdateNonFungibleTokenTransactionOrder(
      this.version,
      this.payload,
      this.stateUnlock,
      ownerProof,
      feeProof,
    );
  }
}
