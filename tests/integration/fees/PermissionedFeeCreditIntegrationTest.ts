import { DeleteFeeCredit } from '../../../src/fees/transactions/DeleteFeeCredit.js';
import { SetFeeCredit } from '../../../src/fees/transactions/SetFeeCredit.js';
import { PartitionIdentifier } from '../../../src/PartitionIdentifier.js';
import { DefaultSigningService } from '../../../src/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../../src/StateApiClientFactory.js';
import { PayToPublicKeyHashPredicate } from '../../../src/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { PayToPublicKeyHashProofFactory } from '../../../src/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../../src/transaction/record/TransactionStatus.js';
import { Base16Converter } from '../../../src/util/Base16Converter.js';
import config from '../config/config.js';
import { createTransactionData } from '../utils/TestUtils.js';

describe('Permissioned Fee Credit Integration Tests', () => {
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const proofFactory = new PayToPublicKeyHashProofFactory(signingService);
  const networkIdentifier = config.networkIdentifier;

  const tokenClient = createTokenClient({
    transport: http(config.tokenPartitionUrl),
  });

  // Uncomment skip to run this test. Backend needs to be started in permissioned mode for this to succeed.
  it.skip('Set and delete fee credit', async () => {
    const round = (await tokenClient.getRoundInfo()).roundNumber;
    const ownerPredicate = PayToPublicKeyHashPredicate.create(signingService.publicKey);

    console.log('Setting fee credit...');
    const setFeeCreditTransactionOrder = await SetFeeCredit.create({
      targetPartitionIdentifier: PartitionIdentifier.TOKEN,
      ownerPredicate: ownerPredicate,
      amount: 100n,
      feeCreditRecord: { unitId: null, counter: null },
      ...createTransactionData(round, networkIdentifier),
    }).sign(proofFactory);

    const setFeeCreditHash = await tokenClient.sendTransaction(setFeeCreditTransactionOrder);
    const setFeeCreditProof = await tokenClient.waitTransactionProof(setFeeCreditHash, SetFeeCredit);
    expect(setFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    const feeCreditRecordId = setFeeCreditTransactionOrder.payload.unitId;
    console.log('Setting fee credit successful');

    console.log('Deleting fee credit...');
    const deleteFeeCreditTransactionOrder = await DeleteFeeCredit.create({
      feeCredit: { unitId: feeCreditRecordId, counter: 0n },
      ...createTransactionData(round, networkIdentifier),
    }).sign(proofFactory);

    const deleteFeeCreditHash = await tokenClient.sendTransaction(deleteFeeCreditTransactionOrder);

    const deleteFeeCreditProof = await tokenClient.waitTransactionProof(deleteFeeCreditHash, DeleteFeeCredit);
    expect(deleteFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(
      TransactionStatus.Successful,
    );
    console.log('Deleting fee credit successful');
  }, 20000);
});
