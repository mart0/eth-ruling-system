import Web3 from "web3";

import { Context } from "koa";
import { INFURA_URL, INFURA_WS_URL } from "../constants";
import { SubscriptionType } from "../enums";

/**
 * Helper class which contains web3-specific functions used in this project.
 * Also, initializes http and web socket clents for fetching info from Infura.
 */
export class Web3Helper {
  // Make sure we are always connected
  private options = {
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 5,
      onTimeout: false
    }
  };
  private web3http: Web3;
  private web3WS: Web3;
  private ctx: Context;

  constructor(ctx: Context) {
    this.web3http = new Web3(new Web3.providers.HttpProvider(INFURA_URL));
    this.web3WS = new Web3(new Web3.providers.WebsocketProvider(INFURA_WS_URL, this.options));
    this.ctx = ctx;
  }

  /**
   * Subscribe to specific events in the blockchain. Right now, the only supported event is 
   * 'pendingTransactions' but this maybe extended if needed.
   * @returns 
   */
  public subscribe() {
    const subscription = this.web3WS.eth.subscribe(SubscriptionType.Pending, (err) => {
      if (err) this.ctx.log.error(err);
    });
  
    return subscription;
  }

  /**
   * Returns a transaction matching the given transaction hash
   * @param {string} hash 
   * @returns 
   */
  public async getTransaction(hash: string) {
    return await this.web3http.eth.getTransaction(hash);
  }

  /**
   * Returns a block matching the block number or block hash.
   * @param {number} blockNumber 
   * @returns 
   */
  public async getBlock(blockNumber: number) {
    return await this.web3WS.eth.getBlock(blockNumber);
  }

  /**
   * Converts any wei value into a ether value.
   * @param {string} value 
   * @returns
   */
  public fromWeiToEther(value: string) {
    return this.web3WS.utils.fromWei(value, "ether");
  }
}




