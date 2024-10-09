import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { FeeCreditTransactionType } from '../../json-rpc/FeeCreditTransactionType.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { AddFeeCreditAttributes, AddFeeCreditAttributesArray } from '../attribute/AddFeeCreditAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { OwnerProofTransactionProof } from '../proof/OwnerProofTransactionProof.js';
import { StateLock } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from './TransactionOrder.js';

export class AddFeeCreditTransactionOrder extends TransactionOrder<AddFeeCreditAttributes, OwnerProofTransactionProof, OwnerProofTransactionProof> {
  public constructor(
    payload: TransactionPayload<AddFeeCreditAttributes>,
    transactionProof: OwnerProofTransactionProof | null,
    feeProof: OwnerProofTransactionProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(FeeCreditTransactionType.AddFeeCredit, payload, transactionProof, feeProof, stateUnlock);
  }

  public static async fromArray([
                            networkIdentifier,
                            systemIdentifier,
                            unitId,
                            ,
                            attributes,
                            stateLock,
                            clientMetadata,
                            stateUnlock,
                            transactionProof,
                            feeProof
                          ]: TransactionOrderArray,
                          cborCodec: ICborCodec): Promise<AddFeeCreditTransactionOrder> {
    return new AddFeeCreditTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        await AddFeeCreditAttributes.fromArray(attributes as AddFeeCreditAttributesArray, cborCodec),
        stateLock ? StateLock.fromArray(stateLock) : null,
        TransactionOrder.decodeClientMetadata(clientMetadata)
      ),
      transactionProof ? await OwnerProofTransactionProof.decode(transactionProof, cborCodec) : null,
      feeProof ? await OwnerProofTransactionProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null
    );
  }
}

