# Alphabill JavaScript SDK

## Development

### Installation

Run following command to install all dependencies `npm install`

### Testing

Project uses [ts-jest](https://kulshekhar.github.io/ts-jest/) for testing.

## Usage

### Examples

To run examples, `npm run build` must be run to generate `lib` folder with
ES2020 code.

### Creation of client

To create a client use following code snippet

```
// 1. Import modules.
import { createPublicClient } from 'alphabill-js-sdk/lib/StateApiClient';
import { http } from 'alphabill-js-sdk/lib/json-rpc/StateApiHttpService';

// 2. Set up your client with transport.
const client = createPublicClient({
    transport: http('http://localhost:8545/rpc', new CborCodecNode()),
});

// 3. Call the client.
const response = await client.getRoundNumber();
console.log(response);
```

