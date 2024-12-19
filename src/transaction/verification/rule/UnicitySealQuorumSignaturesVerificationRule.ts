import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../../../codec/cbor/CborEncoder.js';
import { CborTag } from '../../../codec/cbor/CborTag.js';
import { RootTrustBase } from '../../../RootTrustBase.js';
import { DefaultSigningService } from '../../../signing/DefaultSigningService.js';
import { UnicitySeal } from '../../../unit/UnicityCertificate.js';
import { IVerificationContext } from '../IVerificationContext.js';
import { VerificationResult, VerificationResultCode } from '../VerificationResult.js';
import { VerificationRule } from '../VerificationRule.js';

export class UnicitySealQuorumSignaturesVerificationRule extends VerificationRule {
  public static readonly MESSAGE = 'Are unicity seal quorum signatures valid';

  public verify(context: IVerificationContext): Promise<VerificationResult> {
    const data = this.encodeUnicitySeal(context.proof.transactionProof.unicityCertificate.unicitySeal);
    const hash = sha256.create().update(data).digest();
    const results: VerificationResult[] = [];
    let successful = 0;
    for (const [
      nodeId,
      signature,
    ] of context.proof.transactionProof.unicityCertificate.unicitySeal.signatures.entries()) {
      const result = this.verifySignature(context.trustBase, nodeId, signature, hash);
      if (result.resultCode === VerificationResultCode.OK) {
        successful++;
      }
      results.push(result);
    }

    if (successful >= context.trustBase.quorumThreshold) {
      return Promise.resolve(
        new VerificationResult(
          this,
          UnicitySealQuorumSignaturesVerificationRule.MESSAGE,
          VerificationResultCode.OK,
          null,
          results,
        ),
      );
    }

    return Promise.resolve(
      new VerificationResult(
        this,
        UnicitySealQuorumSignaturesVerificationRule.MESSAGE,
        VerificationResultCode.FAIL,
        'Quorum threshold not reached',
        results,
      ),
    );
  }

  private verifySignature(
    trustBase: RootTrustBase,
    nodeId: string,
    signature: Uint8Array,
    hash: Uint8Array,
  ): VerificationResult {
    const node = trustBase.rootNodes.get(nodeId);
    if (!node) {
      return new VerificationResult(
        this,
        `Is node '${nodeId}' signature valid`,
        VerificationResultCode.FAIL,
        `No root node '${nodeId}' defined in trustbase.`,
      );
    }

    const signatureWORecoveryByte = signature.subarray(0, -1);
    if (!DefaultSigningService.verify(hash, signatureWORecoveryByte, node.publicKey)) {
      return new VerificationResult(
        this,
        `Is node '${nodeId}' signature valid`,
        VerificationResultCode.FAIL,
        `Signature verification failed.`,
      );
    }

    return new VerificationResult(this, `Is node '${nodeId}' signature valid`, VerificationResultCode.OK);
  }

  private encodeUnicitySeal(unicitySeal: UnicitySeal) {
    return CborEncoder.encodeTag(
      CborTag.UNICITY_SEAL,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(unicitySeal.version),
        CborEncoder.encodeUnsignedInteger(unicitySeal.rootChainRoundNumber),
        CborEncoder.encodeUnsignedInteger(unicitySeal.timestamp),
        CborEncoder.encodeByteString(unicitySeal.previousHash),
        CborEncoder.encodeByteString(unicitySeal.hash),
        CborEncoder.encodeNull(),
      ]),
    );
  }
}
