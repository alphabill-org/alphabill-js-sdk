import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { CloseFeeCreditAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/CloseFeeCreditAttributes.js';
import { CloseFeeCreditPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/CloseFeeCreditPayload.js';
import { FeeCreditClientMetadata } from '@alphabill/alphabill-js-sdk/lib/transaction/FeeCreditClientMetadata.js';
import { ReclaimFeeCreditAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/ReclaimFeeCreditAttributes.js';
import { ReclaimFeeCreditPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/ReclaimFeeCreditPayload.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

const cborCodec = new CborCodecNode();
const tokenClient = createPublicClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
});
const moneyClient = createPublicClient({
  transport: http(config.moneyPartitionUrl, cborCodec),
});
const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const unitIds = await tokenClient.getUnitsByOwnerId(signingService.getPublicKey());
const targetUnitIdHex = '0x000000000000000000000000000000000000000000000000000000000000000100';
const targetUnitId = new UnitIdWithType(
  new Uint8Array(Base16Converter.decode(targetUnitIdHex)),
  UnitType.MONEY_PARTITION_BILL_DATA,
);
const feeCreditUnitId = unitIds
  .filter((id) => id.getType().toBase16() === UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD)
  .at(1);

if (!feeCreditUnitId) {
  throw new Error('No fee credit available');
}

const targetBill = await moneyClient.getUnit(targetUnitId, false);
const feeCredit = await tokenClient.getUnit(feeCreditUnitId, false);
const round = await tokenClient.getRoundNumber();

console.log(feeCredit);

let transactionHash = await tokenClient.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new CloseFeeCreditPayload(
      new CloseFeeCreditAttributes(
        feeCredit.getData().getBalance(),
        targetBill.getUnitId(),
        targetBill.getData().getBacklink(),
      ),
      SystemIdentifier.TOKEN_PARTITION,
      feeCredit.getUnitId(),
      new FeeCreditClientMetadata(5n, round + 60n),
    ),
  ),
);

const transactionProof = await waitTransactionProof(tokenClient, transactionHash);

transactionHash = await moneyClient.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new ReclaimFeeCreditPayload(
      new ReclaimFeeCreditAttributes(transactionProof, targetBill.getData().getBacklink()),
      targetBill.getUnitId(),
      new FeeCreditClientMetadata(5n, round + 60n),
    ),
  ),
);

console.log((await waitTransactionProof(moneyClient, transactionHash))?.toString());
