
import Config from "../models/config";
import { PRESERVE_NON_ZERO_TX, PRESERVE_EXPENSIVE_TX, PRESERVE_ALL_TRANSACTIONS } from "../../utils/constants";
import { TransactionTypes } from "../../utils/types";

export async function fetchLatestConfig(): Promise<{ 
  allTransactions: boolean, 
  nonZeroTx: boolean,
  expensiveTx: boolean,
}> {
    // Fetch the latest configuration
    const config = await Config.findAll({
      limit: 1,
      order: [ [ 'createdAt', 'DESC' ]]
    });

    // If for some reason, the result is undefined, set fallback values from default.js
    if (!config || !config.length) {
      return {
        allTransactions: PRESERVE_ALL_TRANSACTIONS,
        nonZeroTx: PRESERVE_NON_ZERO_TX,
        expensiveTx: PRESERVE_EXPENSIVE_TX,
      };
    }

    return config[0].getDataValue("config");
}

export async function updateDynamicConfiguration(newConfig: TransactionTypes) {
  try {
    await Config.upsert({ config: newConfig });
  } catch (error) {
    console.error("An error occured when upserting config into DB", error);
  }
}
