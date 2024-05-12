import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha2';
import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

const cborCodec = new CborCodecNode();
const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const moneyClient = createMoneyClient({
  transport: http(config.moneyPartitionUrl, cborCodec),
  transactionOrderFactory,
});

const targetUnitIdHex = '0x000000000000000000000000000000000000000000000000000000000000000100';
const targetUnitId = new UnitIdWithType(
  new Uint8Array(Base16Converter.decode(targetUnitIdHex)),
  UnitType.MONEY_PARTITION_BILL_DATA,
);
const feeCreditUnitId = new UnitIdWithType(
  sha256(signingService.publicKey),
  UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD,
);

if (!feeCreditUnitId) {
  throw new Error('No fee credit available');
}

/**
 * @type {Bill|null}
 */
const bill = await moneyClient.getUnit(targetUnitId, false);
/**
 * @type {FeeCreditRecord|null}
 */
const feeCreditRecord = await moneyClient.getUnit(feeCreditUnitId, false);
const round = await moneyClient.getRoundNumber();

let transactionHash = await moneyClient.closeFeeCredit(
  {
    bill,
    feeCreditRecord,
  },
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId: null,
  },
);

const proof = await waitTransactionProof(moneyClient, transactionHash);

transactionHash = await moneyClient.reclaimFeeCredit(
  { proof, bill },
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId: null,
  },
);

console.log((await waitTransactionProof(moneyClient, transactionHash))?.toString());
