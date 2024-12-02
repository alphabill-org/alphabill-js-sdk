import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { CreateNonFungibleTokenAttributes } from '../attributes/CreateNonFungibleTokenAttributes.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { TokenPartitionUnitType } from '../TokenPartitionUnitType.js';
import { TokenUnitId } from '../TokenUnitId.js';
import { CreateNonFungibleTokenTransactionOrder } from './CreateNonFungibleTokenTransactionOrder.js';

interface ICreateNonFungibleTokenTransactionData extends ITransactionData {
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
  name: string;
  uri: string;
  data: INonFungibleTokenData;
  dataUpdatePredicate: IPredicate;
  nonce: bigint;
}

export class UnsignedCreateNonFungibleTokenTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<CreateNonFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ICreateNonFungibleTokenTransactionData): UnsignedCreateNonFungibleTokenTransactionOrder {
    const attributes = new CreateNonFungibleTokenAttributes(
      data.type.unitId,
      data.name,
      data.uri,
      data.data,
      data.ownerPredicate,
      data.dataUpdatePredicate,
      data.nonce,
    );
    const tokenUnitId = TokenUnitId.create(attributes, data.metadata, TokenPartitionUnitType.NON_FUNGIBLE_TOKEN);
    return new UnsignedCreateNonFungibleTokenTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        tokenUnitId,
        TokenPartitionTransactionType.CreateNonFungibleToken,
        attributes,
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(
    tokenMintingProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
  ): CreateNonFungibleTokenTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new OwnerProofAuthProof(tokenMintingProofFactory.create(authProof));
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([authProof, ownerProof.encode()])) ?? null;
    return new CreateNonFungibleTokenTransactionOrder(
      this.version,
      this.payload,
      this.stateUnlock,
      ownerProof,
      feeProof,
    );
  }
}
