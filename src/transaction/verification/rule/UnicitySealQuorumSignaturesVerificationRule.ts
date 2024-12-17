import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../../../codec/cbor/CborEncoder.js';
import { CborTag } from '../../../codec/cbor/CborTag.js';
import { RootTrustBase } from '../../../RootTrustBase.js';
import { DefaultSigningService } from '../../../signing/DefaultSigningService.js';
import { UnicitySeal } from '../../../unit/UnicityCertificate.js';
import { IVerificationContext } from '../IVerificationContext.js';
import { Result, ResultCode } from '../Result.js';
import { Rule } from '../Rule.js';

export class UnicitySealQuorumSignaturesVerificationRule extends Rule {
  public static readonly MESSAGE = 'Are unicity seal quorum signatures valid';

  public verify(context: IVerificationContext): Promise<Result> {
    const data = this.encodeUnicitySeal(context.proof.transactionProof.unicityCertificate.unicitySeal);
    const hash = sha256.create().update(data).digest();
    const results: Result[] = [];
    for (const [
      nodeId,
      signature,
    ] of context.proof.transactionProof.unicityCertificate.unicitySeal.signatures.entries()) {
      results.push(this.verifySignature(context.trustBase, nodeId, signature, hash));
    }

    return Promise.resolve(
      Result.createFromResults(this, UnicitySealQuorumSignaturesVerificationRule.MESSAGE, results),
    );
  }

  private verifySignature(trustBase: RootTrustBase, nodeId: string, signature: Uint8Array, hash: Uint8Array): Result {
    const node = trustBase.rootNodes.get(nodeId);
    if (!node) {
      return new Result(
        this,
        `Is node '${nodeId}' signature valid`,
        ResultCode.FAIL,
        `No root node '${nodeId}' defined in trustbase.`,
      );
    }

    const signatureWORecoveryByte = signature.subarray(0, -1);
    if (!DefaultSigningService.verify(hash, signatureWORecoveryByte, node.publicKey)) {
      return new Result(this, `Is node '${nodeId}' signature valid`, ResultCode.FAIL, `Signature verification failed.`);
    }

    return new Result(this, `Is node '${nodeId}' signature valid`, ResultCode.OK);
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
