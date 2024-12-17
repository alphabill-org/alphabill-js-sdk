import { numberToBytesBE } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../../../codec/cbor/CborEncoder.js';
import { UnicityCertificate } from '../../../unit/UnicityCertificate.js';
import { compareUint8Arrays } from '../../../util/ArrayUtils.js';
import { IVerificationContext } from '../IVerificationContext.js';
import { Result, ResultCode } from '../Result.js';
import { Rule } from '../Rule.js';

export class UnicitySealHashMatchesWithRootHashRule extends Rule {
  public static readonly MESSAGE = 'Is unicity seal hash matching root hash';

  public verify(context: IVerificationContext): Promise<Result> {
    const shardTreeCertificateRootHash = this.calculateShardTreeCertificateRootHash(
      context.proof.transactionProof.unicityCertificate,
    );
    const unicityTreeCertificate = context.proof.transactionProof.unicityCertificate.unicityTreeCertificate;
    const key = numberToBytesBE(unicityTreeCertificate.partitionIdentifier, 4);

    let result = sha256
      .create()
      .update(CborEncoder.encodeByteString(new Uint8Array([1])))
      .update(CborEncoder.encodeByteString(key))
      .update(
        CborEncoder.encodeByteString(
          sha256
            .create()
            .update(CborEncoder.encodeByteString(shardTreeCertificateRootHash))
            .update(CborEncoder.encodeByteString(unicityTreeCertificate.partitionDescriptionHash))
            .digest(),
        ),
      )
      .digest();

    for (const step of unicityTreeCertificate.hashSteps) {
      const stepKey = numberToBytesBE(step.key, 4);
      if (compareUint8Arrays(key, stepKey) > 0) {
        result = sha256
          .create()
          .update(new Uint8Array([0]))
          .update(stepKey)
          .update(step.hash)
          .update(result)
          .digest();
      } else {
        result = sha256
          .create()
          .update(new Uint8Array([0]))
          .update(stepKey)
          .update(result)
          .update(step.hash)
          .digest();
      }
    }

    if (compareUint8Arrays(context.proof.transactionProof.unicityCertificate.unicitySeal.hash, result) !== 0) {
      return Promise.resolve(
        new Result(
          this,
          UnicitySealHashMatchesWithRootHashRule.MESSAGE,
          ResultCode.FAIL,
          'Unicity seal hash does not match tree root.',
        ),
      );
    }

    return Promise.resolve(new Result(this, UnicitySealHashMatchesWithRootHashRule.MESSAGE, ResultCode.OK));
  }

  private calculateShardTreeCertificateRootHash(unicityCertificate: UnicityCertificate): Uint8Array {
    let rootHash = sha256
      .create()
      .update(unicityCertificate.inputRecord.encode())
      .update(CborEncoder.encodeByteString(unicityCertificate.trHash))
      .digest();

    const shardId = unicityCertificate.shardTreeCertificate.shard;
    const siblingHashes = unicityCertificate.shardTreeCertificate.siblingHashes;
    for (let i = 0; i < siblingHashes.length; i++) {
      const isRight = shardId.getBitFromEnd(i);
      if (isRight) {
        rootHash = sha256.create().update(siblingHashes[i]).update(rootHash).digest();
      } else {
        rootHash = sha256.create().update(rootHash).update(siblingHashes[i]).digest();
      }
    }

    return new Uint8Array(rootHash);
  }
}
