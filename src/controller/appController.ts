import Transactions from "../db/models/transactions";

import { Context } from "koa";
import { calculateAge, initEthereumNodeClients } from "../utils/helpers";
import { REQUEST_TIMEOUT } from "../utils/constants";

/**
 * Handles the data which serves to /transaction endpoint.
 * @param {Context} ctx - Koa context 
 */
export async function handleTransactions(ctx: Context) {
    const { web3Http, web3WS } = initEthereumNodeClients();

    // Initialize subscription (an event emitter), meaning the very moment someone
    // sends a new transaction (thus, not yet being confirmed), it sends us the transaction hash of that transaction.
    const subscription = web3WS.eth.subscribe('pendingTransactions', (err) => {
        if (err) ctx.log.error(err);
    });

    ctx.log.debug("[+] Watching transactions...");
    subscription.on('data', (txHash) => {
        setTimeout(async () => {
            try {
                const tx = await web3Http.eth.getTransaction(txHash);
                // Skip if it’s a contract creation transaction
                if (tx?.blockNumber && tx?.to) {
                    const txBlock = await web3WS.eth.getBlock(tx.blockNumber);
                    const gasFee = (txBlock && Number(tx.gasPrice) * txBlock.gasUsed) || "0";
                    const txData = {
                        txHash,
                        blockNumber: tx.blockNumber,
                        age: `${calculateAge(txBlock.timestamp)}s`,
                        from: tx.from,
                        to: tx.to,
                        value: web3WS.utils.fromWei(tx.value, 'ether'),
                        fee:  web3WS.utils.fromWei(gasFee.toString(), 'ether'), // Calculated in the same manner as in https://etherscan.io/txs
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
