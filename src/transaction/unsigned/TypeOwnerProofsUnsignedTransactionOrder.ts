import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { IPredicate } from '../predicates/IPredicate.js';
import { IProofFactory } from '../proofs/IProofFactory.js';
import { TypeOwnerProofsAuthProof } from '../proofs/TypeOwnerProofsAuthProof.js';
import { TransactionOrder } from '../TransactionOrder.js';
import { TransactionPayload } from '../TransactionPayload.js';

export class TypeOwnerProofsUnsignedTransactionOrder<Attributes extends ITransactionPayloadAttributes> {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<Attributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public async sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
    tokenTypeOwnerProofs: IProofFactory[],
  ): Promise<TransactionOrder<Attributes, TypeOwnerProofsAuthProof>> {
    const authProofBytes: Uint8Array[] = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const authProof = CborEncoder.encodeArray(authProofBytes);
    const ownerProof = new TypeOwnerProofsAuthProof(
      await ownerProofFactory.create(authProof),
      await Promise.all(tokenTypeOwnerProofs.map((factory) => factory.create(authProof))),
    );
    const feeProof =
      (await feeProofFactory?.create(CborEncoder.encodeArray([...authProofBytes, ownerProof.encode()]))) ?? null;
    return new TransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
