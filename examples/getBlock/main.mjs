import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { MoneyPartitionUnitFactory } from '../../lib/json-rpc/MoneyPartitionUnitFactory.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';

import config from '../config.js';

const client = createPublicClient({
  transport: http(config.moneyPartitionUrl, new MoneyPartitionUnitFactory(), new CborCodecNode()),
});

const round = await client.getRoundNumber();
console.log(Base16Converter.encode(await client.getBlock(round)));
