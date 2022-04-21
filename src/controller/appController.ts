import { Context } from "koa";
import { calculateAge, calculateGasFee } from "../utils/helpers/helpers";
import { Web3Helper } from "../utils/helpers/Web3Helper";
import { REQUEST_TIMEOUT } from "../utils/constants";
import { TransactionTypeEnum } from "../utils/enums";
import { fetchLatestConfig } from "../db/repositories/ConfigRepository";
import { insertTransaction } from "../db/repositories/TransactionsRepository";
import { TransactionDTO } from "../utils/types";

/**
 * This function contains logic whether to monitor and insert transaction data
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
                    const { blockNumber, value, from, to } = tx;

                    const txBlock = await web3.getBlock(blockNumber);

                    const txValue = web3.fromWeiToEther(value);
                    const txGasFee = web3.fromWeiToEther(calculateGasFee(txBlock, tx));

                    // Check if we want to monitor & preserve this transaction based on the
                    // Dynamic configuration. If the current transaction
                    // does not match the criteria, continue to the next one.
                    const { shouldPreserve, type } = await shouldPreserveTx(txValue, txGasFee);
                    if (!shouldPreserve) return;

                    // Prepare the transaction object which is going to be monitored and inserted in DB
                    const txData = {
                        type,
                        txHash,
                        blockNumber,
                        age: calculateAge(txBlock.timestamp),
                        from,
                        to,
                        value: txValue,
                        fee: txGasFee,
                    } as TransactionDTO;
                    
                    ctx.log.info(txData);
                    await insertTransaction(txData, ctx);
                }
            } catch (err) {
                ctx.log.error(err);
            }
        }, REQUEST_TIMEOUT);
    });
}

/**
 * Function which decides if the current transaction should be inserted into DB
 * based on the latest config. Also, sets the transaction type based on the rules above.
 * 
 * @param {string} value 
 * @param {string} gasFee 
 * @returns { { shouldPreserve: boolean, type?: TransactionTypeEnum[]} }
 */
async function shouldPreserveTx(value: string, gasFee: string): Promise<{ shouldPreserve: boolean; type?: TransactionTypeEnum[] }> {

    const { allTransactions, nonZeroTx, expensiveTx } = await fetchLatestConfig();

    if (allTransactions) {
      return { shouldPreserve: true, type:  [TransactionTypeEnum.All]};    
    }

    // There is a possibility to have both flags nonZeroTx and expensiveTx
    // set to true. In this case, the 'type' of the transaction should be ['nonZeroTx', 'expensiveTx'].
    const type = [];
    if (nonZeroTx && Number(value)) {
        type.push(TransactionTypeEnum.NonZeroTx);
    }

    if (expensiveTx && Number(gasFee) > 0.1) {
        type.push(TransactionTypeEnum.ExpensiveTx);
    }

    return type.length ? { shouldPreserve: true, type } : { shouldPreserve: false };
}
