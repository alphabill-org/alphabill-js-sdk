import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';

import config from '../config.js';

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
console.log('Public key in hex encoding: ' + Base16Converter.encode(signingService.getPublicKey()));

// get units from money partition
const moneyClient = createPublicClient({
  transport: http(config.moneyPartitionUrl, new CborCodecNode()),
});

const moneyUnitIds = await moneyClient.getUnitsByOwnerId(signingService.getPublicKey());
if (moneyUnitIds.length > 0) {
  console.log('Money partition units:');
  moneyUnitIds.map((id) => console.log(Base16Converter.encode(id.getBytes())));
}

// get units from token partition
const tokenClient = createPublicClient({
  transport: http(config.tokenPartitionUrl, new CborCodecNode()),
});

const tokenUnitIds = await tokenClient.getUnitsByOwnerId(signingService.getPublicKey());
if (tokenUnitIds.length > 0) {
  console.log('Token partition units:');
  tokenUnitIds.map((id) => console.log(Base16Converter.encode(id.getBytes())));
}
