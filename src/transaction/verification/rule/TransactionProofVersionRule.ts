import { ConditionalVerificationRule } from '../ConditionalVerificationRule.js';
import { IVerificationContext } from '../IVerificationContext.js';

export class TransactionProofVersionRule extends ConditionalVerificationRule {
  public constructor() {
    super('Verify transaction proof version');
  }

  public getCondition(context: IVerificationContext): string {
    return String(context.proof.transactionProof.version);
  }
}
