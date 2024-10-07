import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../order/TransactionOrder.js';
import { TransactionOrderArray } from '../order/TransactionOrderArray.js';
import { TransactionOrderType } from '../TransactionOrderType.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ClientMetadataSerializer } from './ClientMetadataSerializer.js';
import { StateLockSerializer } from './StateLockSerializer.js';

export abstract class TransactionOrderSerializer<Attributes extends ITransactionPayloadAttributes, Proof> {
  protected constructor(
    public readonly type: TransactionOrderType,
    public readonly cborCodec: ICborCodec,
  ) {}

  public async serialize(transactionOrder: TransactionOrder<Attributes, Proof>): Promise<Uint8Array> {
    return this.cborCodec.encode(await this.toArray(transactionOrder));
  }

  public async deserialize(data: Uint8Array): Promise<TransactionOrder<Attributes, Proof>> {
    return this.fromArray((await this.cborCodec.decode(data)) as TransactionOrderArray);
  }

  public abstract toAttributesArray(data: Attributes): Promise<unknown>;
  public abstract toTransactionProofArray(transactionProof: Proof): Promise<unknown>;
  public abstract fromAttributesArray(data: unknown): Promise<Attributes>;
  public abstract fromTransactionProofArray(transactionProof: unknown): Promise<Proof>;

  public async fromArray([
    networkIdentifier,
    systemIdentifier,
    unitId,
    ,
    attributes,
    stateLock,
    clientMetadata,
    stateUnlock,
    transactionProof,
    feeProof,
  ]: TransactionOrderArray): Promise<TransactionOrder<Attributes, Proof>> {
    return new TransactionOrder(
      this.type,
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        await this.fromAttributesArray(attributes),
        stateLock ? StateLockSerializer.fromArray(stateLock) : null,
        ClientMetadataSerializer.fromArray(clientMetadata),
      ),
      transactionProof ? await this.fromTransactionProofArray(transactionProof) : null,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }

  public async toArray({
    type,
    payload,
    transactionProof,
    feeProof,
    stateUnlock,
  }: TransactionOrder<Attributes, Proof>): Promise<TransactionOrderArray> {
    return [
      payload.networkIdentifier,
      payload.systemIdentifier,
      payload.unitId.bytes,
      type,
      await this.toAttributesArray(payload.attributes),
      payload.stateLock ? StateLockSerializer.toArray(payload.stateLock) : null,
      ClientMetadataSerializer.toArray(payload.clientMetadata),
      stateUnlock?.bytes ?? null,
      transactionProof ? await this.cborCodec.encode(await this.toTransactionProofArray(transactionProof)) : null,
      feeProof,
    ];
  }
}
