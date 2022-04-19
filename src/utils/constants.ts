import config from "config";
import dotenv from "dotenv";
dotenv.config();

// App related
export const HOSTNAME: string = config.get("host") || "http://localhost";
export const APP_NAME: string = config.get("appName") || "eth-ruling-system";
export const APP_PORT: number = config.get("appPort") || 3004;

export const INFURA_URL = `https://${process.env.ETHEREUM_NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
export const INFURA_WS_URL = `wss://${process.env.ETHEREUM_NETWORK}.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`;

// DB related
export const DB_HOST = String(process.env.DB_HOST) || "localhost";
export const DB_PORT = Number(process.env.DB_PORT) || 5432;
export const DB_NAME = String(process.env.DB_NAME) || "postgres";
export const DB_USER = String(process.env.DB_USER);
export const DB_PASSWORD = String(process.env.DB_PASSWORD);
