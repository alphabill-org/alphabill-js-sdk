import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { createPublicClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
import config from '../config.js';

const client = createPublicClient({
  transport: http(config.moneyPartitionUrl, new CborCodecNode()),
});

console.log(await client.getRoundNumber());
