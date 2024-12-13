import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { CreateFungibleTokenAttributes } from '../attributes/CreateFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { TokenPartitionUnitType } from '../TokenPartitionUnitType.js';
import { TokenUnitId } from '../TokenUnitId.js';
import { CreateFungibleTokenTransactionOrder } from './CreateFungibleTokenTransactionOrder.js';

interface ICreateFungibleTokenTransactionData extends ITransactionData {
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
  value: bigint;
  nonce: bigint;
}

export class UnsignedCreateFungibleTokenTransactionOrder {
  private constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<CreateFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ICreateFungibleTokenTransactionData): UnsignedCreateFungibleTokenTransactionOrder {
    const attributes = new CreateFungibleTokenAttributes(data.type.unitId, data.value, data.ownerPredicate, data.nonce);
    const tokenUnitId = TokenUnitId.create(attributes, data.metadata, TokenPartitionUnitType.FUNGIBLE_TOKEN);
    return new UnsignedCreateFungibleTokenTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        tokenUnitId,
        TokenPartitionTransactionType.CreateFungibleToken,
        attributes,
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public async sign(
    tokenMintingProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
  ): Promise<CreateFungibleTokenTransactionOrder> {
    const authProofBytes: Uint8Array[] = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const ownerProof = new OwnerProofAuthProof(
      await tokenMintingProofFactory.create(CborEncoder.encodeArray(authProofBytes)),
    );
    const feeProof =
      (await feeProofFactory?.create(CborEncoder.encodeArray([...authProofBytes, ownerProof.encode()]))) ?? null;
    return new CreateFungibleTokenTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
