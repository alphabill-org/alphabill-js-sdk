import { ISigningService } from '../signing/ISigningService.js';
import { TransactionOrder } from './TransactionOrder.js';
import { TransactionPayload } from './TransactionPayload.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { ICborCodec } from '../codec/cbor/ICborCodec.js';

export class TransactionOrderFactory {
  public constructor(
    private readonly cborCoder: ICborCodec,
    private readonly signingService: ISigningService,
    private readonly feeSigningService?: ISigningService,
  ) {}

  public async createTransaction<T extends TransactionPayload<ITransactionPayloadAttributes>>(
    payload: T,
  ): Promise<TransactionOrder<T>> {
    return this.createTransactionOrder(
      payload,
      await this.createOwnerProof(payload),
      payload.clientMetadata.feeCreditRecordId ? await this.createFeeProof(payload) : null,
    );
  }

  private async createOwnerProof(payload: TransactionPayload<ITransactionPayloadAttributes>): Promise<Uint8Array> {
    const signingBytes = await this.cborCoder.encode(payload.getSigningFields());
    return new Uint8Array(
      await this.cborCoder.encode([await this.signingService.sign(signingBytes), this.signingService.publicKey]),
    );
  }

  private async createFeeProof(payload: TransactionPayload<ITransactionPayloadAttributes>): Promise<Uint8Array> {
    const signingBytes = await this.cborCoder.encode(payload.toArray());
    const signingService = this.feeSigningService || this.signingService;

    return new Uint8Array(
      await this.cborCoder.encode([await signingService.sign(signingBytes), this.signingService.publicKey]),
    );
  }

  protected async createTransactionOrder<T extends TransactionPayload<ITransactionPayloadAttributes>>(
    payload: T,
    ownerProof: Uint8Array,
    feeProof: Uint8Array,
  ): Promise<TransactionOrder<T>> {
    const transactionOrderBytes = await this.cborCoder.encode([payload.toArray(), ownerProof, feeProof]);
    return new TransactionOrder<T>(payload, ownerProof, feeProof, transactionOrderBytes);
  }
}
