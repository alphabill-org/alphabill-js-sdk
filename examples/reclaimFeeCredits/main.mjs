import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { CloseFeeCreditAttributes } from '../../lib/transaction/CloseFeeCreditAttributes.js';
import { CloseFeeCreditPayload } from '../../lib/transaction/CloseFeeCreditPayload.js';
import { FeeCreditClientMetadata } from '../../lib/transaction/FeeCreditClientMetadata.js';
import { ReclaimFeeCreditAttributes } from '../../lib/transaction/ReclaimFeeCreditAttributes.js';
import { ReclaimFeeCreditPayload } from '../../lib/transaction/ReclaimFeeCreditPayload.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { UnitIdWithType } from '../../lib/transaction/UnitIdWithType.js';
import { UnitType } from '../../lib/transaction/UnitType.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

const cborCodec = new CborCodecNode();
const tokenClient = createPublicClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
});
const moneyClient = createPublicClient({
  transport: http(config.moneyPartitionUrl, cborCodec),
});
const signingService = new DefaultSigningService(Base16Converter.Decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const unitIds = await tokenClient.getUnitsByOwnerId(signingService.publicKey);
const targetUnitIdHex = '0x000000000000000000000000000000000000000000000000000000000000000100';
const targetUnitId = new UnitIdWithType(
  new Uint8Array(Base16Converter.Decode(targetUnitIdHex)),
  UnitType.MONEY_PARTITION_BILL_DATA,
);
const feeCreditUnitId = unitIds
  .filter((id) => {
    return (
      Base16Converter.Encode(id.getType()) ===
      Base16Converter.Encode(new Uint8Array([UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD]))
    );
  })
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
      new CloseFeeCreditAttributes(feeCredit.data.balance, targetBill.unitId, targetBill.data.backlink),
      SystemIdentifier.TOKEN_PARTITION,
      feeCredit.unitId,
      new FeeCreditClientMetadata(5n, round + 60n),
    ),
  ),
);

const transactionProof = await waitTransactionProof(tokenClient, transactionHash);

transactionHash = await moneyClient.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new ReclaimFeeCreditPayload(
      new ReclaimFeeCreditAttributes(transactionProof, targetBill.data.backlink),
      targetBill.unitId,
      new FeeCreditClientMetadata(5n, round + 60n),
    ),
  ),
);

console.log((await waitTransactionProof(moneyClient, transactionHash))?.toString());
