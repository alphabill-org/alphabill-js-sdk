import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';

import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import config from '../config.js';

const client = createPublicClient({
  transport: http(config.moneyPartitionUrl, new CborCodecNode()),
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const unitIds = await client.getUnitsByOwnerId(signingService.publicKey);
if (unitIds.length > 0) {
  console.log(await client.getUnit(unitIds.at(-1), true));
} else {
  console.log('No units available');
}
