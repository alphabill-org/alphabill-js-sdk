import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../order/TransactionOrder.js';
import { IPredicate } from '../predicates/IPredicate.js';
import { IProofFactory } from '../proofs/IProofFactory.js';
import { TypeDataUpdateProofsAuthProof } from '../proofs/TypeDataUpdateProofsAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';

export class TypeDataUpdateProofsUnsignedTransactionOrder<Attributes extends ITransactionPayloadAttributes> {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<Attributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public async sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
    tokenTypeDataUpdateProofs: IProofFactory[],
  ): Promise<TransactionOrder<Attributes, TypeDataUpdateProofsAuthProof>> {
    const authProofBytes: Uint8Array[] = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const authProof = CborEncoder.encodeArray(authProofBytes);
    const ownerProof = new TypeDataUpdateProofsAuthProof(
      await ownerProofFactory.create(authProof),
      await Promise.all(tokenTypeDataUpdateProofs.map((factory) => factory.create(authProof))),
    );
    const feeProof =
      (await feeProofFactory?.create(CborEncoder.encodeArray([...authProofBytes, ownerProof.encode()]))) ?? null;
    return new TransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
