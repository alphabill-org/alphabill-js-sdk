import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { MoneyPartitionTransactionType } from '../../json-rpc/MoneyPartitionTransactionType.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import {
  TransferBillToDustCollectorAttributes,
  TransferBillToDustCollectorAttributesArray,
} from '../attribute/TransferBillToDustCollectorAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { StateLock } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from './TransactionOrder.js';

export class TransferBillToDustCollectorTransactionOrder extends TransactionOrder<
  TransferBillToDustCollectorAttributes,
  OwnerProofAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<TransferBillToDustCollectorAttributes>,
    authProof: OwnerProofAuthProof | null,
    feeProof: OwnerProofAuthProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(MoneyPartitionTransactionType.TransferBillToDustCollector, payload, authProof, feeProof, stateUnlock);
  }

  public static async fromArray(
    [
      networkIdentifier,
      systemIdentifier,
      unitId,
      ,
      attributes,
      stateLock,
      clientMetadata,
      stateUnlock,
      authProof,
      feeProof,
    ]: TransactionOrderArray,
    cborCodec: ICborCodec,
  ): Promise<TransferBillToDustCollectorTransactionOrder> {
    return new TransferBillToDustCollectorTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        TransferBillToDustCollectorAttributes.fromArray(attributes as TransferBillToDustCollectorAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        TransactionOrder.decodeClientMetadata(clientMetadata),
      ),
      authProof ? await OwnerProofAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}