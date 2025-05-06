import { createMoneyClient, http } from '../../src/StateApiClientFactory.js';
import { Base16Converter } from '../../src/util/Base16Converter.js';

import config from '../config.js';

const client = createMoneyClient({
  transport: http(config.moneyPartitionUrl),
});
const round = (await client.getRoundInfo()).roundNumber - 1n;
console.log(Base16Converter.encode(await client.getBlock(round)));
