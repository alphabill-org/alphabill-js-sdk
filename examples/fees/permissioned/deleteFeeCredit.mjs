import { FeeCreditRecord } from '../../../lib/fees/FeeCreditRecord.js';
import { DeleteFeeCredit } from '../../../lib/fees/transactions/DeleteFeeCredit.js';
import { DefaultSigningService } from '../../../lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '../../../lib/StateApiClientFactory.js';
import { ClientMetadata } from '../../../lib/transaction/ClientMetadata.js';
import { AlwaysTruePredicate } from '../../../lib/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashProofFactory } from '../../../lib/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../../lib/transaction/record/TransactionStatus.js';
import { Base16Converter } from '../../../lib/util/Base16Converter.js';
import config from '../../config.js';

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const proofFactory = new PayToPublicKeyHashProofFactory(signingService);

const client = createTokenClient({
  transport: http(config.permissionedTokenPartitionUrl),
});
const round = (await client.getRoundInfo()).roundNumber;
const feeCreditRecordId = (await client.getUnitsByOwnerId(signingService.publicKey)).feeCreditRecords.at(0);
const feeCreditRecord = await client.getUnit(feeCreditRecordId, false, FeeCreditRecord);

console.log(`Deleting fee credit with ID ${feeCreditRecordId}`);
const deleteFeeCreditTransactionOrder = await DeleteFeeCredit.create({
  feeCredit: { unitId: feeCreditRecordId, counter: feeCreditRecord.counter },
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.permissionedTokenPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, null, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory);
const deleteFeeCreditHash = await client.sendTransaction(deleteFeeCreditTransactionOrder);
const deleteFeeCreditProof = await client.waitTransactionProof(deleteFeeCreditHash, DeleteFeeCredit);
console.log(
  `Delete fee credit response - ${TransactionStatus[deleteFeeCreditProof.transactionRecord.serverMetadata.successIndicator]}`,
);
