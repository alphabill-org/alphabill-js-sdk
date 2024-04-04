/**
 * @typedef {import('@alphabill/alphabill-js-sdk/lib/TransactionProof.js').TransactionProof} TransactionProof
 */

/**
 * Wait for a transaction proof to be available.
 * @param {import('@alphabill/alphabill-js-sdk/lib/StateApiClient').StateApiClient} client State API client.
 * @param {Uint8Array} transactionHash Transaction hash.
 * @param {number} [timeout=10000] Timeout in milliseconds.
 * @param {number} [interval=1000] Interval in milliseconds for polling.
 * @returns {Promise<TransactionProof>} Transaction proof.
 * @throws {string} Timeout.
 */
export function waitTransactionProof(client, transactionHash, timeout = 10000, interval = 1000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const poller = async () => {
      const proof = await client.getTransactionProof(transactionHash);
      if (proof !== null) {
        return resolve(proof);
      }

      if (Date.now() > start + timeout) {
        return reject('Timeout');
      }

      setTimeout(poller, interval);
    };

    poller();
  });
}
