import { createMoneyClient, http } from '../../lib/StateApiClientFactory.js';
import config from '../config.js';

const client = createMoneyClient({
  transport: http(config.moneyPartitionUrl),
});
console.log(await client.getRoundInfo());
