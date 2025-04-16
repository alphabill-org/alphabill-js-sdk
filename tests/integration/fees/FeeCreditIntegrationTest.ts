import { FeeCreditRecord } from '../../../src/fees/FeeCreditRecord.js';
import { AddFeeCredit } from '../../../src/fees/transactions/AddFeeCredit.js';
import { CloseFeeCredit } from '../../../src/fees/transactions/CloseFeeCredit.js';
import { ReclaimFeeCredit } from '../../../src/fees/transactions/ReclaimFeeCredit.js';
import { IUnitId } from '../../../src/IUnitId.js';
import { Bill } from '../../../src/money/Bill.js';
import { DefaultSigningService } from '../../../src/signing/DefaultSigningService.js';
import { createMoneyClient, createTokenClient, http } from '../../../src/StateApiClientFactory.js';
import { PayToPublicKeyHashProofFactory } from '../../../src/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../../src/transaction/record/TransactionStatus.js';
import { Base16Converter } from '../../../src/util/Base16Converter.js';
import config from '../config/config.js';
import { addFeeCredit, createTransactionData } from '../utils/TestUtils.js';

describe('Fee Credit Integration Tests', () => {
  jest.setTimeout(60000);

  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const proofFactory = new PayToPublicKeyHashProofFactory(signingService);
  const networkIdentifier = config.networkIdentifier;
  const moneyPartitionIdentifier = config.moneyPartitionIdentifier;
  const tokenPartitionIdentifier = config.tokenPartitionIdentifier;

  const moneyClient = createMoneyClient({
    transport: http(config.moneyPartitionUrl),
  });
  const tokenClient = createTokenClient({
    transport: http(config.tokenPartitionUrl),
  });

  let feeCreditRecordId: IUnitId; // can no longer be static as hash contains timeout

  it('Add fee credit to money partition', async () => {
    const addFeeCreditHash = await addFeeCredit(
      moneyClient,
      moneyClient,
      moneyPartitionIdentifier,
      networkIdentifier,
      moneyPartitionIdentifier,
      signingService.publicKey,
      proofFactory,
    );

    const addFeeCreditProof = await moneyClient.waitTransactionProof(addFeeCreditHash, AddFeeCredit);
    expect(addFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    feeCreditRecordId = addFeeCreditProof.transactionRecord.transactionOrder.payload.unitId;
    console.log('Adding fee credit successful');
  }, 20000);

  it('Add fee credit to token partition', async () => {
    const addFeeCreditHash = await addFeeCredit(
      moneyClient,
      tokenClient,
      tokenPartitionIdentifier,
      networkIdentifier,
      moneyPartitionIdentifier,
      signingService.publicKey,
      proofFactory,
    );

    const addFeeCreditProof = await tokenClient.waitTransactionProof(addFeeCreditHash, AddFeeCredit);
    expect(addFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Adding fee credit successful');
  }, 20000);

  it('Close and reclaim fee credit', async () => {
    const round = (await moneyClient.getRoundInfo()).roundNumber;
    const billUnitIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).bills;
    expect(billUnitIds.length).toBeGreaterThan(0);
    const billUnitId = billUnitIds[0];
    let bill = await moneyClient.getUnit(billUnitId, false, Bill);
    expect(bill).not.toBeNull();

    const feeCreditRecord = await moneyClient.getUnit(feeCreditRecordId, false, FeeCreditRecord);
    console.log('Closing fee credit...');
    const closeFeeCreditTransactionOrder = await CloseFeeCredit.create({
      bill: bill!,
      feeCreditRecord: feeCreditRecord!,
      ...createTransactionData(round, networkIdentifier, moneyPartitionIdentifier),
    }).sign(proofFactory);
    const closeFeeCreditHash = await moneyClient.sendTransaction(closeFeeCreditTransactionOrder);
    const closeFeeCreditProof = await moneyClient.waitTransactionProof(closeFeeCreditHash, CloseFeeCredit);
    expect(closeFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Closing fee credit successful');

    bill = await moneyClient.getUnit(billUnitId, false, Bill);
    console.log('Reclaiming fee credit...');
    const reclaimFeeCreditTransactionOrder = await ReclaimFeeCredit.create({
      proof: closeFeeCreditProof,
      bill: bill!,
      ...createTransactionData(round, networkIdentifier, moneyPartitionIdentifier),
    }).sign(proofFactory);
    const reclaimFeeCreditHash = await moneyClient.sendTransaction(reclaimFeeCreditTransactionOrder);
    const reclaimFeeCreditProof = await moneyClient.waitTransactionProof(reclaimFeeCreditHash, ReclaimFeeCredit);
    expect(reclaimFeeCreditProof.transactionRecord.serverMetadata.successIndicator).toEqual(
      TransactionStatus.Successful,
    );
    console.log('Reclaiming fee credit successful');
  }, 20000);
});
