import { AggregatedRule } from '../AggregatedRule.js';
import { TransactionOrderVersionRule } from './TransactionOrderVersionRule.js';
import { TransactionRecordVersionRule } from './TransactionRecordVersionRule.js';

export class TransactionRecordStructureRule extends AggregatedRule {
  public constructor() {
    super(
      'TransactionRecordStructureRule',
      new TransactionRecordVersionRule([1n]).onSuccess(new TransactionOrderVersionRule([1n])),
    );
  }
}
