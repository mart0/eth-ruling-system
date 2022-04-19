import Web3 from "web3";

import { INFURA_URL, INFURA_WS_URL } from "../utils/constants";
/**
 * Initialize http and web socket clients from Infura.
 */
 export function initEthereumNodeClients(): { web3Http: Web3, web3WS: Web3 } {
   // Make sure we are always connected
  const options = {
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 5,
      onTimeout: false
    }
  };
  const web3Http = new Web3(new Web3.providers.HttpProvider(INFURA_URL));
  const web3WS = new Web3(new Web3.providers.WebsocketProvider(INFURA_WS_URL, options));

  return { web3Http, web3WS };
}

/**
 * Calculates transaction's age in seconds.
 * @param {timestamp}
 * @return {number}
 */
export function calculateAge(timestamp: string | number): number {
  const start = new Date(Number(timestamp) * 1000).getSeconds();
  const end  = new Date().getSeconds();
  return end - start;
}
