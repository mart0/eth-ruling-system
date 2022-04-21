
import Config from "../models/config";
import { PRESERVE_NON_ZERO_TX, PRESERVE_EXPENSIVE_TX, PRESERVE_ALL_TRANSACTIONS } from "../../utils/constants";
import { TransactionTypes } from "../../utils/types";
import { Context } from "koa";

/**
 * Fetches the latest configuration from tblConfig. If there is none,
 * the default one specified in default.js will be returned.
 * @returns {TransactionTypes}
 */
export async function fetchLatestConfig(): Promise<TransactionTypes> {
    // Fetch the latest configuration
    const config = await Config.findAll({
      limit: 1,
      order: [ [ 'createdAt', 'DESC' ]]
    });

    // Use the config from default.js as a fallback config
    if (!config || !config.length) {
      return {
        allTransactions: PRESERVE_ALL_TRANSACTIONS,
        nonZeroTx: PRESERVE_NON_ZERO_TX,
        expensiveTx: PRESERVE_EXPENSIVE_TX,
      };
    }

    const result = config[0].getDataValue("config");

    return {
      allTransactions: result.allTransactions === 'true',
      nonZeroTx: result.nonZeroTx === 'true',
      expensiveTx: result.expensiveTx === 'true',
    };
}

/**
 * Creates new configuration record in tblConfig to be used from the app.
 * @param {TransactionTypes} newConfig
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function updateDynamicConfiguration(newConfig: TransactionTypes, ctx: Context): Promise<void> {
  try {
    await Config.upsert({ config: newConfig });
  } catch (error) {
    ctx.log.error("An error occured when inserting config into DB", error);
  }
}
