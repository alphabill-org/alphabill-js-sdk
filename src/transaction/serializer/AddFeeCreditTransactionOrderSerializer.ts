import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { TransactionRecordWithProofArray } from '../../TransactionRecordWithProof.js';
import { AddFeeCreditAttributes } from '../attribute/AddFeeCreditAttributes.js';
import { TransactionOrderType } from '../TransactionOrderType.js';
import { TransactionOrderSerializer } from './TransactionOrderSerializer.js';
import { TransactionRecordWithProofSerializer } from './TransactionRecordWithProofSerializer.js';
import { TransferFeeCreditTransactionOrderSerializer } from './TransferFeeCreditTransactionOrderSerializer.js';

type AddFeeCreditAttributesArray = [Uint8Array, ...TransactionRecordWithProofArray];

export class AddFeeCreditTransactionOrderSerializer extends TransactionOrderSerializer<
  AddFeeCreditAttributes,
  Uint8Array
> {
  private readonly transferFeeCreditTransactionOrderSerializer: TransferFeeCreditTransactionOrderSerializer;

  public constructor(cborCodec: ICborCodec) {
    super(TransactionOrderType.AddFeeCredit, cborCodec);
    this.transferFeeCreditTransactionOrderSerializer = new TransferFeeCreditTransactionOrderSerializer(cborCodec);
  }

  public async toAttributesArray({
    ownerPredicate,
    transactionProof,
  }: AddFeeCreditAttributes): Promise<AddFeeCreditAttributesArray> {
    return [
      ownerPredicate.bytes,
      ...(await TransactionRecordWithProofSerializer.toArray(
        transactionProof,
        this.transferFeeCreditTransactionOrderSerializer,
      )),
    ];
  }

  public async fromAttributesArray([
    predicate,
    transactionRecord,
    transactionProof,
  ]: AddFeeCreditAttributesArray): Promise<AddFeeCreditAttributes> {
    return new AddFeeCreditAttributes(
      new PredicateBytes(predicate),
      await TransactionRecordWithProofSerializer.fromArray(
        [transactionRecord, transactionProof],
        this.transferFeeCreditTransactionOrderSerializer,
      ),
    );
  }

  public toTransactionProofArray(transactionProof: Uint8Array): Promise<unknown> {
    return Promise.resolve(transactionProof);
  }

  public fromTransactionProofArray(data: unknown): Promise<Uint8Array> {
    return Promise.resolve(data as Uint8Array);
  }
}
