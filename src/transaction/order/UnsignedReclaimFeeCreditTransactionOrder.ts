import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { ReclaimFeeCreditAttributes } from '../attribute/ReclaimFeeCreditAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { ReclaimFeeCreditTransactionOrder } from './ReclaimFeeCreditTransactionOrder';
import { TransactionOrder } from './TransactionOrder';

export class UnsignedReclaimFeeCreditTransactionOrder implements IUnsignedTransactionOrder<ReclaimFeeCreditAttributes> {
  public constructor(
    public readonly payload: TransactionPayload<ReclaimFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<ReclaimFeeCreditAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new ReclaimFeeCreditTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
