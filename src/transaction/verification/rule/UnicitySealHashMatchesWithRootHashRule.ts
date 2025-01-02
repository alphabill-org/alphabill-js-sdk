import { numberToBytesBE } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../../../codec/cbor/CborEncoder.js';
import { UnicityCertificate } from '../../../unit/UnicityCertificate.js';
import { compareUint8Arrays } from '../../../util/ArrayUtils.js';
import { IVerificationContext } from '../IVerificationContext.js';
import { VerificationResult, VerificationResultCode } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

export class UnicitySealHashMatchesWithRootHashRule extends VerificationRule {
  public static readonly MESSAGE = 'Is unicity seal hash matching root hash';
  private static readonly LEAF = new Uint8Array([1]);
  private static readonly NODE = new Uint8Array([0]);

  public verify(context: IVerificationContext): Promise<VerificationResult> {
    const shardTreeCertificateRootHash = this.calculateShardTreeCertificateRootHash(
      context.proof.transactionProof.unicityCertificate,
    );

    const unicityTreeCertificate = context.proof.transactionProof.unicityCertificate.unicityTreeCertificate;
    const key = numberToBytesBE(unicityTreeCertificate.partitionIdentifier, 4);

    let result = sha256
      .create()
      .update(CborEncoder.encodeByteString(UnicitySealHashMatchesWithRootHashRule.LEAF))
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
      const hasher = sha256
        .create()
        .update(CborEncoder.encodeByteString(UnicitySealHashMatchesWithRootHashRule.NODE))
        .update(CborEncoder.encodeByteString(stepKey));

      if (compareUint8Arrays(key, stepKey) > 0) {
        result = hasher
          .update(CborEncoder.encodeByteString(step.hash))
          .update(CborEncoder.encodeByteString(result))
          .digest();
      } else {
        result = hasher
          .update(CborEncoder.encodeByteString(result))
          .update(CborEncoder.encodeByteString(step.hash))
          .digest();
      }
    }

    const unicitySealHash = context.proof.transactionProof.unicityCertificate.unicitySeal.hash;
    if (unicitySealHash == null || compareUint8Arrays(unicitySealHash, result) !== 0) {
      return Promise.resolve(
        new VerificationResult(
          this,
          UnicitySealHashMatchesWithRootHashRule.MESSAGE,
          VerificationResultCode.FAIL,
          'Unicity seal hash does not match tree root.',
        ),
      );
    }

    return Promise.resolve(
      new VerificationResult(this, UnicitySealHashMatchesWithRootHashRule.MESSAGE, VerificationResultCode.OK),
    );
  }

  private calculateShardTreeCertificateRootHash(unicityCertificate: UnicityCertificate): Uint8Array {
    let rootHash = sha256
      .create()
      .update(unicityCertificate.inputRecord.encode())
      .update(
        unicityCertificate.trHash ? CborEncoder.encodeByteString(unicityCertificate.trHash) : CborEncoder.encodeNull(),
      )
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
