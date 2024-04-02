import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { createPublicClient } from '../../lib/StateApiClient.js';
import config from '../config.js';

const client = createPublicClient({
  transport: http(config.moneyPartitionUrl, new CborCodecNode()),
});

console.log(await client.getRoundNumber());
