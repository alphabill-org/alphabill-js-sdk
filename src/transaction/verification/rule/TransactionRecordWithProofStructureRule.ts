import { AggregatedRule } from '../AggregatedRule.js';
import { TransactionProofVersionRule } from './TransactionProofVersionRule.js';
import { TransactionRecordWithProofSuccessRule } from './TransactionRecordWithProofSuccessRule.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TransactionRecordWithProofStructureRule extends AggregatedRule {
  public constructor() {
    super(
      'Verify transaction record with proof structure',
      new TransactionRecordWithProofSuccessRule().onSuccess(new TransactionProofVersionRule([1n])),
    );
  }
}
