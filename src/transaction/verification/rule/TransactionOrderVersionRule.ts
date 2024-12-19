import { ConditionalVerificationRule } from '../ConditionalVerificationRule.js';
import { IVerificationContext } from '../IVerificationContext.js';

export class TransactionOrderVersionRule extends ConditionalVerificationRule {
  public constructor() {
    super('Verify transaction order version');
  }

  public getCondition(context: IVerificationContext): string {
    return String(context.proof.transactionRecord.transactionOrder.version);
  }
}
