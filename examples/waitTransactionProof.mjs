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
