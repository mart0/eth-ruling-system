import Transactions from "../db/models/transactions";

import { Context } from "koa";
import { calculateAge, calculateGasFee } from "../utils/helpers/helpers";
import { REQUEST_TIMEOUT } from "../utils/constants";
import { Web3Helper } from "../utils/helpers/Web3Helper";
import { TransactionType } from "../utils/enums";

/**
 * Handles the data which serves to /transaction endpoint.
 * @param {Context} ctx - Koa context 
 */
export async function handleTransactions(ctx: Context) {
    const web3 = new Web3Helper(ctx);

    const subscription = web3.subscribe();

    ctx.log.debug("[+] Watching transactions...");
    subscription.on('data', (txHash) => {
        setTimeout(async () => {
            try {
                const tx = await web3.getTransaction(String(txHash));
                // Skip if it’s a contract creation transaction
                if (tx?.blockNumber && tx?.to) {
                    const txBlock = await web3.getBlock(tx.blockNumber);
                    const txData = {
                        type: TransactionType.Test,
                        txHash,
                        blockNumber: tx.blockNumber,
                        age: `${calculateAge(txBlock.timestamp)}s`,
                        from: tx.from,
                        to: tx.to,
                        value: web3.fromWeiToEther(tx.value),
                        fee:  web3.fromWeiToEther(calculateGasFee(txBlock, tx)),
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
