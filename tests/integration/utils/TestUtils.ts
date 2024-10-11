import { StateApiClient } from '../../../src/StateApiClient.js';
import { ITransactionClientMetadata } from '../../../src/transaction/ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from '../../../src/transaction/ITransactionPayloadAttributes.js';
import { TransactionRecordWithProof } from '../../../src/transaction/record/TransactionRecordWithProof.js';
import { UnitIdWithType } from '../../../src/transaction/UnitIdWithType.js';

/**
 * Wait for a transaction proof to be available.
 * @param {StateApiClient} client State API client.
 * @param {Uint8Array} transactionHash Transaction hash.
 * @param {number} [timeout=10000] Timeout in milliseconds.
 * @param {number} [interval=1000] Interval in milliseconds for polling.
 * @returns {Promise<TransactionRecordWithProof>} Transaction proof.
 * @throws {string} Timeout.
 */
export function waitTransactionProof<T extends ITransactionPayloadAttributes>(
  client: StateApiClient,
  transactionHash: Uint8Array,
  timeout = 10000,
  interval = 1000,
): Promise<TransactionRecordWithProof<T>> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const poller = async (): Promise<void> => {
      const proof = await client.getTransactionProof(transactionHash);
      if (proof !== null) {
        return resolve(proof as TransactionRecordWithProof<T>);
      }

      if (Date.now() > start + timeout) {
        return reject('Timeout');
      }

      setTimeout(poller, interval);
    };

    poller();
  });
}

export function createMetadata(round: bigint, feeCreditRecordId?: UnitIdWithType): ITransactionClientMetadata {
  return {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId: feeCreditRecordId ?? null,
    referenceNumber: new Uint8Array(),
  };
}
