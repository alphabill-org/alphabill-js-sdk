import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createMoneyClient, createTokenClient, http } from '../../lib/StateApiClientFactory.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
import config from '../config.js';

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));

console.log('Public key in hex encoding: ' + Base16Converter.encode(signingService.publicKey));

const moneyClient = createMoneyClient({
  transport: http(config.moneyPartitionUrl),
});

const tokenClient = createTokenClient({
  transport: http(config.tokenPartitionUrl),
});

const billIds = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).bills;
if (billIds.length > 0) {
  console.log('Money partition units:');
  billIds.map((id) => console.log(id.toString()));
}

// get fungible tokens from token partition
const tokenUnitIds = (await tokenClient.getUnitsByOwnerId(signingService.publicKey)).fungibleTokens;
if (tokenUnitIds.length > 0) {
  console.log('Token partition fungible tokens:');
  tokenUnitIds.map((id) => console.log(id.toString()));
}
