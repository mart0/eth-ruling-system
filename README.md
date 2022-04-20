# eth-ruling-system

## Description
A ruling system that monitors and watches all Ethereum transactions. Also, stores and filters data based on predefined dynamic configuration.
## Prerequisites

- Node - v16.14.2
- npm - v8.5.0
```
NOTE: Using [nvm](https://github.com/nvm-sh/nvm) for installing node and npm (or other node version manager tool) is recommended.
```
- Rename __.env.development.example__ to __.env__ and make sure that the following env variables are correctly set there:

```
ETHEREUM_NETWORK = <YOUR_ETHEREUM_NETWORK> // Any testnet like Ropsten, Kovan, Rinkeby, etc.
INFURA_PROJECT_ID = <YOUR_INFURA_PROJECT_ID> // Can be obtained once you have registered at https://infura.io/

// In order to have a full working environment is important to have a local PostgreSQL instance up and running.
// Also, it would be convenient if you have installed PostgreSQL GUI tool such as pgAdmin 4 or DataGrip (recommended).
DB_HOST=localhost
DB_PORT=5434
DB_NAME=<YOUR_DB_NAME>
DB_USER=<YOUR_DB_USER>
DB_PASSWORD=<YOUR_DB_PASSWORD>
```
### Important NOTE
Please have in mind that if the variables above are not set their default values will be used (see __src/utils/constants.ts__) which
most probably won't work in your case.

## Build & Run
```
npm install
npm run build
npm start
```

## Trigger transaction monitoring

Once the application is up and running, navigate to *http://localhost/transactions* from your browser in order to trigger the monitoring. 
You should see the following response:

```
{
  "isSuccess": true,
  "message": "Transaction monitoring has been started. Please check your DB for more information about each transaction.",
  "status": 200
}
```

...or just do a Curl request from your terminal:

```
curl http://localhost:3004/transactions
```

