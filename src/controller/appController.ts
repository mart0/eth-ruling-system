import Transactions from "../db/models/transactions";

import { Context } from "koa";
import { calculateAge, calculateGasFee, Web3Helper } from "../utils/helpers";
import { REQUEST_TIMEOUT, PRESERVE_NON_ZERO_TX, PRESERVE_EXPENSIVE_TX, PRESERVE_ALL_TRANSACTIONS } from "../utils/constants";
import { TransactionType } from "../utils/enums";

/**
 * This function contains logic whether to upsert a transaction info
 * into the DB or not.
 * @param {Context} ctx - Koa context 
 */
export async function handleTransactions(ctx: Context) {
    const web3 = new Web3Helper(ctx);

    const subscription = web3.subscribe();

    ctx.log.debug("[+] Watching transactions...");
    subscription.on("data", (txHash) => {
        setTimeout(async () => {
            try {
                const tx = await web3.getTransaction(String(txHash));
                // Skip if it’s a contract creation transaction
                if (tx?.blockNumber && tx?.to) {
                    const { blockNumber, value, from, to} = tx;

                    const txBlock = await web3.getBlock(blockNumber);

                    const txValue = web3.fromWeiToEther(value);
                    const txGasFee = web3.fromWeiToEther(calculateGasFee(txBlock, tx));

                    // Check if we want to monitor & preserve this transaction based on the
                    // Dynamic configuration from default.js. If the current transaction
                    // does not match the criteria, continue to the next one.
                    const { shouldPreserve, type } = shouldPreserveTx(txValue, txGasFee);
                    if (!shouldPreserve) return;

                    // Prepare the object which is going to be printed and upserted
                    const txData = {
                        type,
                        txHash,
                        blockNumber,
                        age: `${calculateAge(txBlock.timestamp)}s`,
                        from,
                        to,
                        value: txValue,
                        fee: txGasFee,
                    };
                    
                    ctx.log.info(txData);
                    try {
                        await Transactions.upsert(txData)
                    } catch (error) {
                        ctx.log.error("An error occured when upserting data into DB", error);
                    }
                }
            } catch (err) {
                ctx.log.error(err);
            }
        }, REQUEST_TIMEOUT);
    });
}

/**
 * Function which decides if the current transaction should be inserted into DB
 * based on some pre-defined rules. The rules have priority, meaning if the first one 
 * is satisfied, the transaction will NOT check the others and will create new record in
 * our DB for this transaction. 
 * 
 * The rules priority is as it follows:
 * 
 * Case 0 - All transactions will be preserved (other flags are not checked):
 * PRESERVE_ALL_TRANSACTIONS - true
 * PRESERVE_NON_ZERO_TX - true/false
 * PRESERVE_EXPENSIVE_TX - true/false
 * 
 * Case 1 - Only transactions with value bigger than 0 will be preserved (no matter if their gas fee):
 * PRESERVE_ALL_TRANSACTIONS - false
 * PRESERVE_NON_ZERO_TX - true
 * PRESERVE_EXPENSIVE_TX - false
 * 
 * Case 2 - Only transactions with gas fee bigger than 0,1 will be preserved (no matter if their value):
 * PRESERVE_ALL_TRANSACTIONS - false
 * PRESERVE_NON_ZERO_TX - false
 * PRESERVE_EXPENSIVE_TX - true
 * 
 * Case 3 - Only transactions with value bigger than 0 AND with gas fee bigger than 0,1 (Case 1 + Case 2):
 * PRESERVE_ALL_TRANSACTIONS - false
 * PRESERVE_NON_ZERO_TX - true
 * PRESERVE_EXPENSIVE_TX - true
 * 
 * Case 4 - There will be no preserved transactions:
 * PRESERVE_ALL_TRANSACTIONS - false
 * PRESERVE_NON_ZERO_TX - false
 * PRESERVE_EXPENSIVE_TX - false
 * 
 * Also, sets the transaction type based on the rules above.
 * 
 * @param {string} value 
 * @param {string} gasFee 
 * @returns { { shouldPreserve: boolean, type?: TransactionType[]} }
 */
function shouldPreserveTx(value: string, gasFee: string) {

    if (PRESERVE_ALL_TRANSACTIONS) {
      return { shouldPreserve: true, type:  [TransactionType.All]};    
    }

    // There is a possibility to have both flags PRESERVE_NON_ZERO_TX and PRESERVE_EXPENSIVE_TX
    // set to true. In this case, the 'type' of the transaction should be ['nonZeroValue', 'expensiveTx'].
    const type = [];
    if (PRESERVE_NON_ZERO_TX && Number(value)) {
        type.push(TransactionType.NonZeroValue);
    }

    if (PRESERVE_EXPENSIVE_TX && Number(gasFee) > 0.1) {
        type.push(TransactionType.ExpensiveTx);
    }

    return type.length ? { shouldPreserve: true, type } : { shouldPreserve: false };
}
