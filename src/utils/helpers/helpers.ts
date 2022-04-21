import { Transaction } from "web3-core";
import { BlockTransactionString } from "web3-eth";

/**
 * Calculates transaction's age in seconds.
 * @param {string | number} timestamp 
 * @returns {string}
 */
export function calculateAge(timestamp: string | number): string {
  const start = new Date(Number(timestamp) * 1000).getSeconds();
  const end  = new Date().getSeconds();
  return `${end - start}s`;
}

/**
 * Calculate gas fee in the same manner as in https://etherscan.io/txs.
 * @param {BlockTransactionString} txBlock 
 * @param {Transaction} tx 
 * @returns {string}
 */
export function calculateGasFee(txBlock: BlockTransactionString, tx: Transaction) {
  const gasFee = (txBlock && Number(tx.gasPrice) * txBlock.gasUsed) || "0";
  return gasFee.toString();
}
