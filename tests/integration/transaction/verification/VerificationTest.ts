import { AddFeeCredit } from '../../../../src/fees/transactions/AddFeeCredit.js';
import { DefaultSigningService } from '../../../../src/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '../../../../src/StateApiClientFactory.js';
import { PayToPublicKeyHashProofFactory } from '../../../../src/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { DefaultVerificationPolicy } from '../../../../src/transaction/verification/DefaultVerificationPolicy.js';
import { VerificationResultCode } from '../../../../src/transaction/verification/VerificationResult.js';
import { Base16Converter } from '../../../../src/util/Base16Converter.js';
import config from '../../config/config.js';
import { addFeeCredit } from '../../utils/TestUtils.js';

describe('Proof verification', () => {
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const proofFactory = new PayToPublicKeyHashProofFactory(signingService);
  const networkIdentifier = config.networkIdentifier;
  const partitionIdentifier = config.moneyPartitionIdentifier;

  const moneyClient = createMoneyClient({
    transport: http(config.moneyPartitionUrl),
  });

  it('Add fee credit record with proof verification', async () => {
    const addFeeCreditHash = await addFeeCredit(
      moneyClient,
      moneyClient,
      partitionIdentifier,
      networkIdentifier,
      partitionIdentifier,
      signingService.publicKey,
      proofFactory,
    );

    const roundInfo = await moneyClient.getRoundInfo();
    const context = {
      proof: await moneyClient.waitTransactionProof(addFeeCreditHash, AddFeeCredit),
      trustBase: await moneyClient.getTrustBase(roundInfo.roundNumber),
    };

    const result = await new DefaultVerificationPolicy().verify(context);

    console.log(result.toString());
    expect(result.resultCode).toBe(VerificationResultCode.OK);
  }, 20000);
});
