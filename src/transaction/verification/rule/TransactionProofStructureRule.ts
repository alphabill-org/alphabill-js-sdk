import { AggregatedRule } from '../AggregatedRule.js';
import { TransactionProofVersionRule } from './TransactionProofVersionRule.js';

export class TransactionProofStructureRule extends AggregatedRule {
  public constructor() {
    super('TransactionProofStructureRule', new TransactionProofVersionRule([1n]));
  }
}
