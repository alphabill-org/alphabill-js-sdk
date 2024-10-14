import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { TokenUnitId } from '../../util/TokenUnitId.js';
import { CreateFungibleTokenAttributes } from '../attribute/CreateFungibleTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TokenPartitionUnitType } from '../TokenPartitionUnitType.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { CreateFungibleTokenTransactionOrder } from './types/CreateFungibleTokenTransactionOrder.js';

interface ICreateFungibleTokenTransactionData extends ITransactionData {
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
  value: bigint;
  nonce: bigint;
}

export class UnsignedCreateFungibleTokenTransactionOrder {
  private constructor(
    public readonly payload: TransactionPayload<CreateFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static async create(
    data: ICreateFungibleTokenTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedCreateFungibleTokenTransactionOrder> {
    const attributes = new CreateFungibleTokenAttributes(data.ownerPredicate, data.type.unitId, data.value, data.nonce);

    return new UnsignedCreateFungibleTokenTransactionOrder(
      new TransactionPayload(
        data.networkIdentifier,
        SystemIdentifier.TOKEN_PARTITION,
        await TokenUnitId.create(attributes, data.metadata, codec, TokenPartitionUnitType.FUNGIBLE_TOKEN),
        TokenPartitionTransactionType.CreateFungibleToken,
        attributes,
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
      codec,
    );
  }

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<CreateFungibleTokenTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = new OwnerProofAuthProof(
      await ownerProofSigner.sign(ownerProofBytes),
      ownerProofSigner.publicKey,
    );

    const feeProof = new OwnerProofAuthProof(
      await feeProofSigner.sign(
        await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock, ownerProof]),
      ),
      feeProofSigner.publicKey,
    );

    return new CreateFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
