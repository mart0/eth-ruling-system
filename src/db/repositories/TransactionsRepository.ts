import { Context } from "koa";
import { TransactionDTO } from "../../utils/types";
import Transactions from "../models/transactions";

/**
 * Creates new transaction record in tblTransactions. 
 * @param transaction 
 * @param {Context} ctx
 * @returns {Promise<void>}
 */
export async function insertTransaction(transaction: TransactionDTO, ctx: Context): Promise<void> {
  try {
    await Transactions.upsert(transaction);
  } catch (error) {
    ctx.log.error("An error occured when inserting transaction into DB", error);
  }
}
