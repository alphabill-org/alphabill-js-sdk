import { createPublicClient } from '../../lib/StateApiClient.js';
import { MoneyPartitionUnitFactory } from '../../lib/json-rpc/MoneyPartitionUnitFactory.js';
import { CborCodecNode }  from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';

import config from '../config.js';


const client = createPublicClient({
  transport: http(config.moneyPartitionUrl, new MoneyPartitionUnitFactory(), new CborCodecNode()),
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const unitIds = await client.getUnitsByOwnerId(signingService.publicKey);
unitIds.map((id) => console.log(Base16Converter.encode(id.getBytes())));
