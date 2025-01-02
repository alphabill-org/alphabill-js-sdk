import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../../../codec/cbor/CborEncoder.js';
import { compareUint8Arrays } from '../../../util/ArrayUtils.js';
import { ITransactionPayloadAttributes } from '../../ITransactionPayloadAttributes.js';
import { ITransactionOrderProof } from '../../proofs/ITransactionOrderProof.js';
import { TransactionProofChainItem } from '../../record/TransactionProofChainItem.js';
import { TransactionRecord } from '../../record/TransactionRecord.js';
import { TransactionOrder } from '../../TransactionOrder.js';
import { IVerificationContext } from '../IVerificationContext.js';
import { VerificationResult, VerificationResultCode } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

export class MerkleTreeBlockHashVerificationRule extends VerificationRule {
  public static readonly MESSAGE = 'Is merkle tree block hash equal to unicity certificate input record block hash';

  public verify(context: IVerificationContext): Promise<VerificationResult> {
    const { transactionProof, transactionRecord } = context.proof;
    const rootHash = this.calculateMerkleTreeRootHash(transactionProof.chain, transactionRecord);

    const inputRecordPreviousHash = transactionProof.unicityCertificate.inputRecord.previousHash;
    const inputRecordHash = transactionProof.unicityCertificate.inputRecord.hash;
    const blockHash = sha256
      .create()
      .update(CborEncoder.encodeByteString(transactionProof.blockHeaderHash))
      .update(
        inputRecordPreviousHash ? CborEncoder.encodeByteString(inputRecordPreviousHash) : CborEncoder.encodeNull(),
      )
      .update(inputRecordHash ? CborEncoder.encodeByteString(inputRecordHash) : CborEncoder.encodeNull())
      .update(CborEncoder.encodeByteString(rootHash))
      .digest();

    const inputRecordBlockHash = transactionProof.unicityCertificate.inputRecord.blockHash;
    if (inputRecordBlockHash == null || compareUint8Arrays(blockHash, inputRecordBlockHash) === 0) {
      return Promise.resolve(
        new VerificationResult(this, MerkleTreeBlockHashVerificationRule.MESSAGE, VerificationResultCode.OK),
      );
    }

    return Promise.resolve(
      new VerificationResult(
        this,
        MerkleTreeBlockHashVerificationRule.MESSAGE,
        VerificationResultCode.FAIL,
        'Block hashes do not match',
      ),
    );
  }

  private calculateMerkleTreeRootHash(
    chain: TransactionProofChainItem[] | null,
    transactionRecord: TransactionRecord<
      TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof | null>
    >,
  ): Uint8Array {
    let result = sha256.create().update(transactionRecord.encode()).digest();
    for (const path of chain!) {
      if (path.left) {
        result = sha256
          .create()
          .update(CborEncoder.encodeByteString(result))
          .update(CborEncoder.encodeByteString(path.hash))
          .digest();
      } else {
        result = sha256
          .create()
          .update(CborEncoder.encodeByteString(path.hash))
          .update(CborEncoder.encodeByteString(result))
          .digest();
      }
    }

    return result;
  }
}
