import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { AlwaysTruePredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/AlwaysTruePredicate.js';
import { EmptyOwnerProofTransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/EmptyOwnerProofTransactionOrderFactory.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';
import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

const cborCodec = new CborCodecNode();
const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new EmptyOwnerProofTransactionOrderFactory();

const moneyClient = createMoneyClient({
  transport: http(config.moneyPartitionUrl, cborCodec),
  transactionOrderFactory,
});

const initialBillId = UnitIdWithType.fromBytes(
  Base16Converter.decode('0x000000000000000000000000000000000000000000000000000000000000000100'),
);
let bill = await moneyClient.getUnit(initialBillId, false);
const round = await moneyClient.getRoundNumber();
const feeCreditRecordId = new UnitIdWithType(
  sha256(sha256(signingService.publicKey)),
  UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD,
);
const feeCreditRecord = (await moneyClient.getUnit(feeCreditRecordId, false))?.data || {
  unitId: feeCreditRecordId,
  counter: null,
};

const transferFeeCreditTransactionHash = await moneyClient.transferToFeeCredit(
  {
    bill,
    amount: 100n,
    systemIdentifier: SystemIdentifier.MONEY_PARTITION,
    feeCreditRecord,
    latestAdditionTime: round + 60n,
  },
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId: null,
  },
);

let transactionProof = await waitTransactionProof(moneyClient, transferFeeCreditTransactionHash);

const addFeeCreditTransactionHash = await moneyClient.addFeeCredit(
  {
    ownerPredicate: new AlwaysTruePredicate(),
    proof: transactionProof,
    feeCreditRecord,
  },
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId: null,
  },
);

transactionProof = await waitTransactionProof(moneyClient, addFeeCreditTransactionHash);
bill = await moneyClient.getUnit(initialBillId, false);

moneyClient.transferBill(
  {
    ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
    bill,
  },
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId: feeCreditRecord.unitId,
  },
);
