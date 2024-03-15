import { createPublicClient } from '../../lib/StateApiClient.js';
import { MoneyPartitionUnitFactory } from '../../lib/json-rpc/MoneyPartitionUnitFactory.js';
import { CborCodecNode }  from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import config from '../config.js';

const client = createPublicClient({
  transport: http(config.moneyPartitionUrl, new MoneyPartitionUnitFactory(), new CborCodecNode()),
});

console.log(await client.getRoundNumber());
