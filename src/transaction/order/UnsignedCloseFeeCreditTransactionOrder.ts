import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { CloseFeeCreditAttributes } from '../attribute/CloseFeeCreditAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { CloseFeeCreditTransactionOrder } from './types/CloseFeeCreditTransactionOrder.js';

export class UnsignedCloseFeeCreditTransactionOrder
  implements IUnsignedTransactionOrder<CloseFeeCreditTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<CloseFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<CloseFeeCreditTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new CloseFeeCreditTransactionOrder(
      this.payload,
      new OwnerProofAuthProof(ownerProof, ownerProofSigner.publicKey),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
