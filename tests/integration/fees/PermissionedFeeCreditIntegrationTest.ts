import { CborCodecNode } from '../../../src/codec/cbor/CborCodecNode.js';
import { DeleteFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/DeleteFeeCreditTransactionRecordWithProof.js';
import { SetFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/SetFeeCreditTransactionRecordWithProof.js';
import { UnsignedDeleteFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedDeleteFeeCreditTransactionOrder.js';
import { UnsignedSetFeeCreditTransactionOrder } from '../../../src/fees/transactions/UnsignedSetFeeCreditTransactionOrder.js';
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
  const cborCodec = new CborCodecNode();
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const proofFactory = new PayToPublicKeyHashProofFactory(signingService, cborCodec);

  const tokenClient = createTokenClient({
    transport: http(config.tokenPartitionUrl, new CborCodecNode()),
  });

  it('Set and delete fee credit', async () => {
    const round = await tokenClient.getRoundNumber();
    const ownerPredicate = await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey);

    console.log('Setting fee credit...');
    const setFeeCreditTransactionOrder = await UnsignedSetFeeCreditTransactionOrder.create(
      {
        targetPartitionIdentifier: PartitionIdentifier.TOKEN,
        ownerPredicate: ownerPredicate,
        amount: 100n,
        feeCreditRecord: { unitId: null, counter: null },
        ...createTransactionData(round),
      },
      cborCodec,
    ).sign(proofFactory);

    const setFeeCreditHash = await tokenClient.sendTransaction(setFeeCreditTransactionOrder);
    const setFeeCreditProof = await tokenClient.waitTransactionProof(
      setFeeCreditHash,
      SetFeeCreditTransactionRecordWithProof,
    );
    expect(setFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    const feeCreditRecordId = setFeeCreditTransactionOrder.payload.unitId;
    console.log('Setting fee credit successful');

    console.log('Deleting fee credit...');
    const deleteFeeCreditTransactionOrder = await UnsignedDeleteFeeCreditTransactionOrder.create(
      {
        feeCredit: { unitId: feeCreditRecordId, counter: 0n },
        ...createTransactionData(round),
      },
      cborCodec,
    ).sign(proofFactory);

    const deleteFeeCreditHash = await tokenClient.sendTransaction(deleteFeeCreditTransactionOrder);

    const deleteFeeCreditProof = await tokenClient.waitTransactionProof(
      deleteFeeCreditHash,
      DeleteFeeCreditTransactionRecordWithProof,
    );
    expect(deleteFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(
      TransactionStatus.Successful,
    );
    console.log('Deleting fee credit successful');
  }, 20000);
});
