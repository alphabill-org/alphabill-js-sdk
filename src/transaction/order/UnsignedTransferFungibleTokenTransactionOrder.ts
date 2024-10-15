import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { TransferFungibleTokenAttributes } from '../attribute/TransferFungibleTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { TypeOwnerProofsAuthProof } from '../proof/TypeOwnerProofsAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { TransferFungibleTokenTransactionOrder } from './types/TransferFungibleTokenTransactionOrder.js';

interface ITransferFungibleTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint; value: bigint };
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
}

export class UnsignedTransferFungibleTokenTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<TransferFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ITransferFungibleTokenTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedTransferFungibleTokenTransactionOrder> {
    return Promise.resolve(
      new UnsignedTransferFungibleTokenTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.token.unitId,
          TokenPartitionTransactionType.TransferFungibleToken,
          new TransferFungibleTokenAttributes(
            data.ownerPredicate,
            data.token.value,
            data.token.counter,
            data.type.unitId,
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
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
    tokenTypeOwnerProofs: IProofFactory[],
  ): Promise<TransferFungibleTokenTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const authProofBytes = await this.codec.encode(authProof);
    const ownerProof = new TypeOwnerProofsAuthProof(
      await ownerProofFactory.create(authProofBytes),
      await Promise.all(tokenTypeOwnerProofs.map((factory) => factory.create(authProofBytes))),
    );
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new TransferFungibleTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
