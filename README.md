# eth-ruling-system

## Description
A ruling system that monitors and watches all Ethereum transactions. Also, stores and filters data based on predefined dynamic configuration.
## Prerequisites

- Node - v16.14.2
- npm - v8.5.0
```
NOTE: Using nvm for installing node and npm (or other node version manager tool) is recommended.

## Build & Run

There are 2 ways to run the project - with local node instance and with Docker (the faster way):

1. Run with local node instance

```
- Rename __.env.development.example__ to __.env__ and make sure that the following env variables are correctly set there:

```
ETHEREUM_NETWORK = <YOUR_ETHEREUM_NETWORK> // Any testnet like Ropsten, Kovan, Rinkeby, etc.
INFURA_PROJECT_ID = <YOUR_INFURA_PROJECT_ID> // Can be obtained once you have registered at https://infura.io/

// In order to have a full working environment, it's important to have a local PostgreSQL instance up and running.
// Also, it would be convenient if you have installed PostgreSQL GUI tool such as pgAdmin 4 or DataGrip.
DB_HOST=localhost
DB_PORT=5434
DB_NAME=<YOUR_DB_NAME>
DB_USER=<YOUR_DB_USER>
DB_PASS=<YOUR_DB_PASS>
```
### Important note
Please have in mind that if the variables above are not set their default values will be used (see __src/utils/constants.ts__) which
most probably won't work in your case.

Once the env variables are set, install dependencies, build the project, and then it's ready to be started:
```
npm install
npm run build
npm start
```

2. Run with Docker

- Make sure you have Docker installed on your machine. Adjust the environment variables by renaming __.env.docker.example__ to __.env__ and run:
```
docker-compose up -d --build (you may want to skip the -d flag if you want to see the logs for any reason)
```

## Trigger transaction monitoring

Once the application is up and running, navigate to *http://localhost:3004/transactions* from your browser in order to trigger the monitoring. 
You should see the following response:

```
{
  "isSuccess": true,
  "status": 200,
  "message": "Transaction monitoring has been started. Please check your DB for more information about each transaction."
}
```

...or just do a Curl request from your terminal:

```
curl http://localhost:3004/transactions
```

## Pre-defined dynamic configuration

In order to monitor and preserve transactions, a pre-defined configuration should be specified (if it's not specified explicitly, the default one will be used - see __default.js__ dynamicConfig section).

There is a dedicated endpoint for this purpose - POST __/serviceConfig__. Here is an example of how can this endpoint be used:

```
curl -X POST \
  http://localhost:3004/serviceConfig \
  -H 'content-type: application/json' \
  -d '{
    "allTransactions": "true",
    "nonZeroTx": "false",
    "expensiveTx": "false"
}'
```

In the request body should be specified which transactions to be monitored & preserved in the DB. The possible combinations are:

* If __allTransactions__ flag is set to true, all transactions will be monitored and preserved. This means that a new record will be created for each transaction and it will be marked with "type": {all} in the DB. In this case, the other flags __nonZeroTx__ and __expensiveTx__ are not considered, meaning that their values doesn't matter;
* If __nonZeroTx__ flag is set to true, transactions with values bigger than 0 will be monitored and preserved. The record in the DB will be marked with "type": {nonZeroTx};
* If __expensiveTx__ flag is set to true, transactions with gas fees bigger than 0,1 will be monitored and preserved. The record in the DB will be marked with "type": {expensiveTx};

* If both __nonZeroTx__ and __expensiveTx__ are set to true, a combination of both rules will be applied. In the DB the transaction will be preserved with "type": {nonZeroTx, expensiveTx};

## Ideas for further improvement

* Write unit tests using [Jest](https://www.npmjs.com/package/jest) with at least 90% code coverage
* Write automation tests using [Cucumber](https://www.npmjs.com/package/cucumber)
* Implement request/response validation using [Joi](https://www.npmjs.com/package/joi) or  [jsonschema](https://www.npmjs.com/package/jsonschema)
* Improve the logging and error handling
* Implement a proper UI using React JS - for example, to be possible the CRUD operations within the application to be triggered by buttons (without firing requests using Curl, Postman or any other client)
* Implement API documentation using [Swagger](https://swagger.io/)
