import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier';
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
    public readonly payload: Promise<TransactionPayload<CreateNonFungibleTokenAttributes>>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ICreateNonFungibleTokenTransactionData,
    codec: ICborCodec,
  ): UnsignedCreateNonFungibleTokenTransactionOrder {
    const attributes = new CreateNonFungibleTokenAttributes(
      data.ownerPredicate,
      data.type.unitId,
      data.name,
      data.uri,
      data.data,
      data.dataUpdatePredicate,
      data.nonce,
    );

    const payload = TokenUnitId.create(
      attributes,
      data.metadata,
      codec,
      TokenPartitionUnitType.NON_FUNGIBLE_TOKEN,
    ).then(
      (unitId) =>
        new TransactionPayload(
          data.networkIdentifier,
          PartitionIdentifier.TOKEN,
          unitId,
          TokenPartitionTransactionType.CreateNonFungibleToken,
          attributes,
          data.stateLock,
          data.metadata,
        ),
    );

    return new UnsignedCreateNonFungibleTokenTransactionOrder(payload, data.stateUnlock, codec);
  }

  public async sign(
    tokenMintingProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
  ): Promise<CreateNonFungibleTokenTransactionOrder> {
    const payload = await this.payload;
    const authProof = [...(await payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(
      await tokenMintingProofFactory.create(await this.codec.encode(authProof)),
    );
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new CreateNonFungibleTokenTransactionOrder(payload, ownerProof, feeProof, this.stateUnlock);
  }
}
