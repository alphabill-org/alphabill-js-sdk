import { ConditionalRule } from '../ConditionalRule.js';
import { IVerificationContext } from '../IVerificationContext.js';

export class TransactionProofVersionRule extends ConditionalRule {
  public constructor() {
    super('Verify transaction proof version');
  }

  public getCondition(context: IVerificationContext): string {
    return String(context.proof.transactionProof.version);
  }
}
