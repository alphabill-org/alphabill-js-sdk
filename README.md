# Alphabill JavaScript SDK

## Development

### Installation

Run following command to install all dependencies `npm install`

### Testing

Project uses [ts-jest](https://kulshekhar.github.io/ts-jest/) for testing.

To run unit tests, run `npm run test`

To run integration tests via dockerized Alphabill, run `npm run docker:alphabill` to start Alphabill nodes. When running Alphabill locally, change values in `tests/integration/config.ts` to reflect local setup. 

Afterwards run `npm run integration-test`. Running tests through IDE likely starts them all at once and some will fail. 

## Usage

### Package

Latest nightly build is in npm registry with `dev` tag. 
