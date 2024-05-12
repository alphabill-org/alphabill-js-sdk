import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createMoneyClient, createTokenClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import config from '../config.js';

const cborCodec = new CborCodecNode();
const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

console.log('Public key in hex encoding: ' + Base16Converter.encode(signingService.publicKey));

const moneyClient = createMoneyClient({
  transport: http(config.moneyPartitionUrl, new CborCodecNode()),
  transactionOrderFactory,
});

const tokenClient = createTokenClient({
  transport: http(config.tokenPartitionUrl, new CborCodecNode()),
  transactionOrderFactory,
});

const moneyUnitIds = await moneyClient.getUnitsByOwnerId(signingService.publicKey);
if (moneyUnitIds.length > 0) {
  console.log('Money partition units:');
  moneyUnitIds.map((id) => console.log(Base16Converter.encode(id.bytes)));
}

// get units from token partition
const tokenUnitIds = await tokenClient.getUnitsByOwnerId(signingService.publicKey);
if (tokenUnitIds.length > 0) {
  console.log('Token partition units:');
  tokenUnitIds.map((id) => console.log(Base16Converter.encode(id.bytes)));
}
