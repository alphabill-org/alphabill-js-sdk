import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { SubTypeOwnerProofsAuthProof } from '../../transaction/proofs/SubTypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { CreateFungibleTokenTypeAttributes } from '../attributes/CreateFungibleTokenTypeAttributes.js';
import { TokenIcon } from '../TokenIcon.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { CreateFungibleTokenTypeTransactionOrder } from './CreateFungibleTokenTypeTransactionOrder.js';

interface ICreateFungibleTokenTypeTransactionData extends ITransactionData {
  type: { unitId: IUnitId };
  symbol: string;
  name: string;
  icon: { type: string; data: Uint8Array };
  parentTypeId: IUnitId | null;
  decimalPlaces: number;
  subTypeCreationPredicate: IPredicate;
  tokenMintingPredicate: IPredicate;
  tokenTypeOwnerPredicate: IPredicate;
}

export class UnsignedCreateFungibleTokenTypeTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<CreateFungibleTokenTypeAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ICreateFungibleTokenTypeTransactionData): UnsignedCreateFungibleTokenTypeTransactionOrder {
    return new UnsignedCreateFungibleTokenTypeTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.type.unitId,
        TokenPartitionTransactionType.CreateFungibleTokenType,
        new CreateFungibleTokenTypeAttributes(
          data.symbol,
          data.name,
          new TokenIcon(data.icon.type, data.icon.data),
          data.parentTypeId,
          data.decimalPlaces,
          data.subTypeCreationPredicate,
          data.tokenMintingPredicate,
          data.tokenTypeOwnerPredicate,
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
  ): CreateFungibleTokenTypeTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new SubTypeOwnerProofsAuthProof(
      subTypeCreationProofs.map((factory) => factory.create(authProof)),
    );
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([authProof, ownerProof.encode()])) ?? null;
    return new CreateFungibleTokenTypeTransactionOrder(
      this.version,
      this.payload,
      ownerProof,
      feeProof,
      this.stateUnlock,
    );
  }
}
