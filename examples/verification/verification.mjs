import { TransferFeeCredit } from '../../lib/fees/transactions/TransferFeeCredit.js';
import { Bill } from '../../lib/money/Bill.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '../../lib/StateApiClientFactory.js';
import { ClientMetadata } from '../../lib/transaction/ClientMetadata.js';
import { AlwaysTruePredicate } from '../../lib/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { PayToPublicKeyHashProofFactory } from '../../lib/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { DefaultVerificationPolicy } from '../../lib/transaction/verification/DefaultVerificationPolicy.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
import config from '../config.js';

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const proofFactory = new PayToPublicKeyHashProofFactory(signingService);

const client = createMoneyClient({
  transport: http(config.moneyPartitionUrl),
});

const billIds = (await client.getUnitsByOwnerId(signingService.publicKey)).bills;
const bill = await client.getUnit(billIds[0], false, Bill);
const round = (await client.getRoundInfo()).roundNumber;

const transferFeeCreditTransactionOrder = await TransferFeeCredit.create({
  amount: 10n,
  targetPartitionIdentifier: config.moneyPartitionIdentifier,
  latestAdditionTime: round + 60n,
  feeCreditRecord: { ownerPredicate: await PayToPublicKeyHashPredicate.create(signingService.publicKey) },
  bill,
  version: 1n,
  networkIdentifier: config.networkIdentifier,
  partitionIdentifier: config.moneyPartitionIdentifier,
  stateLock: null,
  metadata: new ClientMetadata(round + 60n, 5n, null, new Uint8Array()),
  stateUnlock: new AlwaysTruePredicate(),
}).sign(proofFactory);
const transferFeeCreditHash = await client.sendTransaction(transferFeeCreditTransactionOrder);
const transferFeeCreditProof = await client.waitTransactionProof(transferFeeCreditHash, TransferFeeCredit);

const context = {
  proof: transferFeeCreditProof,
  trustBase: await client.getTrustBase(round),
};

const result = await new DefaultVerificationPolicy().verify(context);
console.log(result.toString());
