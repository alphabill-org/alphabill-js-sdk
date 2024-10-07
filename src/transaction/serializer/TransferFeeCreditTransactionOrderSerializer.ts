import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { UnitId } from '../../UnitId.js';
import { TransferFeeCreditAttributes } from '../attribute/TransferFeeCreditAttributes.js';
import { TransactionOrderType } from '../TransactionOrderType.js';
import { TransactionOrderSerializer } from './TransactionOrderSerializer.js';

/**
 * Transfer fee credit attributes array.
 */
export type TransferFeeCreditAttributesArray = readonly [
  bigint,
  SystemIdentifier,
  Uint8Array,
  bigint,
  bigint | null,
  bigint,
];

export class TransferFeeCreditTransactionOrderSerializer extends TransactionOrderSerializer<
  TransferFeeCreditAttributes,
  Uint8Array
> {
  public constructor(cborCodec: ICborCodec) {
    super(TransactionOrderType.TransferFeeCredit, cborCodec);
  }

  public toAttributesArray({
    amount,
    targetSystemIdentifier,
    targetUnitId,
    latestAdditionTime,
    targetUnitCounter,
    counter,
  }: TransferFeeCreditAttributes): Promise<TransferFeeCreditAttributesArray> {
    return Promise.resolve([
      amount,
      targetSystemIdentifier,
      targetUnitId.bytes,
      latestAdditionTime,
      targetUnitCounter,
      counter,
    ]);
  }

  public fromAttributesArray([
    amount,
    targetSystemIdentifier,
    targetUnitId,
    latestAdditionTime,
    targetUnitCounter,
    counter,
  ]: TransferFeeCreditAttributesArray): Promise<TransferFeeCreditAttributes> {
    return Promise.resolve(
      new TransferFeeCreditAttributes(
        BigInt(amount),
        targetSystemIdentifier,
        UnitId.fromBytes(targetUnitId),
        BigInt(latestAdditionTime),
        targetUnitCounter ? BigInt(targetUnitCounter) : null,
        BigInt(counter),
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
