import config from "config";
import dotenv from "dotenv";

import { WebsocketProviderOptions } from "web3-core-helpers";

dotenv.config();

// App related
export const HOSTNAME: string = config.get("app.host") || "http://localhost";
export const APP_NAME: string = config.get("app.name") || "eth-ruling-system";
export const APP_PORT: number = config.get("app.port") || 3004;

export const ETHEREUM_NETWORK: string = String(process.env.ETHEREUM_NETWORK) || "rinkeby";
export const INFURA_PROJECT_ID: string = String(process.env.INFURA_PROJECT_ID) || "63650b70756a4d468af58c44f618e7d1";

export const INFURA_URL = `https://${ETHEREUM_NETWORK}.infura.io/v3/${INFURA_PROJECT_ID}`;
export const INFURA_WS_URL = `wss://${ETHEREUM_NETWORK}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
export const INFURA_WEB_SOCKET_OPTS: WebsocketProviderOptions = config.get("infuraWebSocketOptions") || {};
export const REQUEST_TIMEOUT: number = config.get("transactionRequestTimeout") || 3000;

// DB related
export const DB_HOST = String(process.env.DB_HOST) || "localhost";
export const DB_PORT = Number(process.env.DB_PORT) || 5432;
export const DB_NAME = String(process.env.DB_NAME) || "postgres";
export const DB_USER = String(process.env.DB_USER) || "admin";
export const DB_PASS = String(process.env.DB_PASS) || "admin";

// Dynamic Configuration.
// This application will store and filter data based on the predefined dynamic configuration below:

// If this flag is set to 'true', the application will preserve ALL transactions
export const PRESERVE_ALL_TRANSACTIONS: boolean = config.get("dynamicConfig.allTransactions") || false;

// If this flag is set to 'true', the application will preserve transactions with value bigger than 0
export const PRESERVE_NON_ZERO_TX: boolean = config.get("dynamicConfig.nonZeroTx") || false;

// If this flag is set to 'true', the application will preserve transactions with gas fee more than 0,1
export const PRESERVE_EXPENSIVE_TX: boolean = config.get("dynamicConfig.expensiveTx") || false;
