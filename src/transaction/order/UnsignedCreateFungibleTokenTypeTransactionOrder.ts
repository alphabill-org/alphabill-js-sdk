import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { CreateFungibleTokenTypeAttributes } from '../attribute/CreateFungibleTokenTypeAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { SubTypeOwnerProofsAuthProof } from '../proof/SubTypeOwnerProofsAuthProof.js';
import { TokenIcon } from '../TokenIcon.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { CreateFungibleTokenTypeTransactionOrder } from './types/CreateFungibleTokenTypeTransactionOrder.js';

interface ICreateFungibleTokenTypeTransactionData extends ITransactionData {
  type: { unitId: IUnitId };
  symbol: string;
  name: string;
  icon: { type: string; data: Uint8Array };
  parentTypeId: IUnitId | null;
  decimalPlaces: number;
  subTypeCreationPredicate: IPredicate;
  tokenCreationPredicate: IPredicate;
  tokenTypeOwnerPredicate: IPredicate;
}

export class UnsignedCreateFungibleTokenTypeTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<CreateFungibleTokenTypeAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ICreateFungibleTokenTypeTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedCreateFungibleTokenTypeTransactionOrder> {
    return Promise.resolve(
      new UnsignedCreateFungibleTokenTypeTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.type.unitId,
          TokenPartitionTransactionType.CreateFungibleTokenType,
          new CreateFungibleTokenTypeAttributes(
            data.symbol,
            data.name,
            new TokenIcon(data.icon.type, data.icon.data),
            data.parentTypeId,
            data.decimalPlaces,
            data.subTypeCreationPredicate,
            data.tokenCreationPredicate,
            data.tokenTypeOwnerPredicate,
          ),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
    subTypeCreationProofs: (Uint8Array | null)[],
  ): Promise<CreateFungibleTokenTypeTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new CreateFungibleTokenTypeTransactionOrder(
      this.payload,
      new SubTypeOwnerProofsAuthProof(ownerProof, ownerProofSigner.publicKey, subTypeCreationProofs),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
