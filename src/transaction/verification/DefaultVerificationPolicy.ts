import { AggregatedVerificationRule } from './AggregatedVerificationRule.js';
import { MerkleTreeBlockHashVerificationRule } from './rule/MerkleTreeBlockHashVerificationRule.js';
import { TransactionOrderVersionRule } from './rule/TransactionOrderVersionRule.js';
import { TransactionProofVersionRule } from './rule/TransactionProofVersionRule.js';
import { TransactionRecordWithProofSuccessRule } from './rule/TransactionRecordWithProofSuccessRule.js';
import { UnicitySealHashMatchesWithRootHashRule } from './rule/UnicitySealHashMatchesWithRootHashRule.js';
import { UnicitySealQuorumSignaturesVerificationRule } from './rule/UnicitySealQuorumSignaturesVerificationRule.js';

export class DefaultVerificationPolicy extends AggregatedVerificationRule {
  public constructor() {
    super(
      'Verify transaction record with proof',
      new TransactionRecordWithProofSuccessRule().onSuccess(
        new TransactionProofVersionRule().on(
          String(1n),
          new TransactionOrderVersionRule().on(
            String(1n),
            new UnicitySealHashMatchesWithRootHashRule().onSuccess(
              new UnicitySealQuorumSignaturesVerificationRule().onSuccess(new MerkleTreeBlockHashVerificationRule()),
            ),
          ),
        ),
      ),
    );
  }
}
