import Transactions from "../models/transactions";

export async function insertTransaction(transaction: any): Promise<void> {
  try {
    await Transactions.upsert(transaction);
  } catch (error) {
    console.error("An error occured when upserting transaction into DB", error);
  }
}
