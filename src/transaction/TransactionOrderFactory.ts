import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { ISigningService } from '../signing/ISigningService.js';
import { AlwaysTruePredicate } from './AlwaysTruePredicate.js';
import { ITransactionOrderFactory } from './ITransactionOrderFactory.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransactionOrder } from './TransactionOrder.js';
import { TransactionPayload } from './TransactionPayload.js';

/**
 * Transaction order factory.
 */
export class TransactionOrderFactory implements ITransactionOrderFactory {
  /**
   * Transaction order factory constructor.
   * @param {ICborCodec} cborCodec - CBOR codec.
   * @param {ISigningService} signingService - Signing service.
   * @param {ISigningService} [feeSigningService] - Fee signing service.
   */
  public constructor(
    private readonly cborCodec: ICborCodec,
    private readonly signingService: ISigningService,
    private readonly feeSigningService?: ISigningService,
  ) {}

  /**
   * Create transaction order.
   * @param {T} payload - Transaction payload.
   * @returns {Promise<TransactionOrder<T>>} Transaction order.
   */
  public async createTransaction<T extends TransactionPayload<ITransactionPayloadAttributes>>(
    payload: T,
  ): Promise<TransactionOrder<T>> {
    return new TransactionOrder(
      payload,
      await this.createOwnerProof(payload),
      payload.clientMetadata.feeCreditRecordId ? await this.createFeeProof(payload) : null,
      new AlwaysTruePredicate().bytes, // FIXME allow user to define StateUnlock
    );
  }

  private async createOwnerProof(payload: TransactionPayload<ITransactionPayloadAttributes>): Promise<Uint8Array> {
    const signingBytes = await this.cborCodec.encode(payload.getSigningFields());
    return new Uint8Array(
      await this.cborCodec.encode([await this.signingService.sign(signingBytes), this.signingService.publicKey]),
    );
  }

  private async createFeeProof(payload: TransactionPayload<ITransactionPayloadAttributes>): Promise<Uint8Array> {
    const signingBytes = await this.cborCodec.encode(payload.toArray());
    const signingService = this.feeSigningService || this.signingService;

    return new Uint8Array(
      await this.cborCodec.encode([await signingService.sign(signingBytes), this.signingService.publicKey]),
    );
  }
}
