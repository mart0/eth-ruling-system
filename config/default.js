module.exports = {
  app: {
    name: "eth-ruling-system",
    host: "http://localhost",
    port: 3004,
  },
  transactionRequestTimeout: 3000,
  dynamicConfig: {
    allTransactions: false,
    nonZeroTx: true,
    expensiveTx: true,
  }
};
