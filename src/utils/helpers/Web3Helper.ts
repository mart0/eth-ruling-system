import Web3 from "web3";

import { Context } from "koa";
import { INFURA_URL, INFURA_WEB_SOCKET_OPTS, INFURA_WS_URL } from "../constants";
import { SubscriptionType } from "../enums";

/**
 * Helper class which contains web3-specific functions used within the project.
 * Also, initializes http and web socket clents for fetching Ehereum transaction info from Infura.
 */
export class Web3Helper {
  private web3http: Web3;
  private web3WS: Web3;
  private ctx: Context;

  constructor(ctx: Context) {
    this.web3http = new Web3(new Web3.providers.HttpProvider(INFURA_URL));
    this.web3WS = new Web3(new Web3.providers.WebsocketProvider(INFURA_WS_URL, INFURA_WEB_SOCKET_OPTS));
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
   * Returns a transaction matching the given transaction hash.
   * @param {string} hash 
   * @returns
   */
  public async getTransaction(hash: string) {
    return await this.web3http.eth.getTransaction(hash);
  }

  /**
   * Returns a block matching the block number.
   * @param {number} blockNumber 
   * @returns 
   */
  public async getBlock(blockNumber: number) {
    return await this.web3WS.eth.getBlock(blockNumber);
  }

  /**
   * Converts any wei value into a ether value.
   * @param {string} value 
   * @returns {string}
   */
  public fromWeiToEther(value: string) {
    return this.web3WS.utils.fromWei(value, "ether");
  }
}




