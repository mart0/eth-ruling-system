module.exports = {
  app: {
    name: "eth-ruling-system",
    host: "http://localhost",
    port: 3004,
  },
  infuraWebSocketOptions: {
    reconnect: {
      auto: true,
      delay: 5 * 1000, // ms
      maxAttempts: 5,
      onTimeout: false
    }
  },
  transactionRequestTimeout: 3 * 1000,
  dynamicConfig: {
    allTransactions: true,
    nonZeroTx: false,
    expensiveTx: false,
  }
};
