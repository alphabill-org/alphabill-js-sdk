import { TransactionStatus } from '../../record/TransactionStatus.js';
import { IVerificationContext } from '../IVerificationContext.js';
import { VerificationResult, VerificationResultCode } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

export class TransactionRecordWithProofSuccessRule extends VerificationRule {
  public static readonly MESSAGE = 'Is transaction record with proof successful';

  public verify(context: IVerificationContext): Promise<VerificationResult> {
    if (context.proof.transactionRecord.serverMetadata.successIndicator === TransactionStatus.Successful) {
      return Promise.resolve(
        new VerificationResult(this, TransactionRecordWithProofSuccessRule.MESSAGE, VerificationResultCode.OK),
      );
    }

    return Promise.resolve(
      new VerificationResult(
        this,
        TransactionRecordWithProofSuccessRule.MESSAGE,
        VerificationResultCode.FAIL,
        'Transaction record with proof is not successful.',
      ),
    );
  }
}
