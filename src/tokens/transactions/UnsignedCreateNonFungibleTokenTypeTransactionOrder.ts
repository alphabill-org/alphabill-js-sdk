import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { SubTypeOwnerProofsAuthProof } from '../../transaction/proofs/SubTypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { CreateNonFungibleTokenTypeAttributes } from '../attributes/CreateNonFungibleTokenTypeAttributes.js';
import { TokenIcon } from '../TokenIcon.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { CreateNonFungibleTokenTypeTransactionOrder } from './CreateNonFungibleTokenTypeTransactionOrder.js';

interface ICreateNonFungibleTokenTypeTransactionData extends ITransactionData {
  type: { unitId: IUnitId };
  symbol: string;
  name: string;
  icon: { type: string; data: Uint8Array };
  parentTypeId: IUnitId | null;
  subTypeCreationPredicate: IPredicate;
  tokenMintingPredicate: IPredicate;
  tokenTypeOwnerPredicate: IPredicate;
  dataUpdatePredicate: IPredicate;
}

export class UnsignedCreateNonFungibleTokenTypeTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<CreateNonFungibleTokenTypeAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(
    data: ICreateNonFungibleTokenTypeTransactionData,
  ): UnsignedCreateNonFungibleTokenTypeTransactionOrder {
    return new UnsignedCreateNonFungibleTokenTypeTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.type.unitId,
        TokenPartitionTransactionType.CreateNonFungibleTokenType,
        new CreateNonFungibleTokenTypeAttributes(
          data.symbol,
          data.name,
          new TokenIcon(data.icon.type, data.icon.data),
          data.parentTypeId,
          data.subTypeCreationPredicate,
          data.tokenMintingPredicate,
          data.tokenTypeOwnerPredicate,
          data.dataUpdatePredicate,
        ),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(
    feeProofFactory: IProofFactory | null,
    subTypeCreationProofs: IProofFactory[],
  ): CreateNonFungibleTokenTypeTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new SubTypeOwnerProofsAuthProof(
      subTypeCreationProofs.map((factory) => factory.create(authProof)),
    );
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([authProof, ownerProof.encode()])) ?? null;
    return new CreateNonFungibleTokenTypeTransactionOrder(
      this.version,
      this.payload,
      this.stateUnlock,
      ownerProof,
      feeProof,
    );
  }
}
