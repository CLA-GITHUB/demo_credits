import Database from "../db/database";
import Transaction from "../models/transaction";
import { TTransaction } from "../types/types";

export default class extends Database {
  constructor() {
    super();
  }

  async getTransaction(filter: string): Promise<Transaction | null> {
    const transaction = await this.connection<Transaction>("transactions")
      .where("id", filter)
      .first();

    if (!transaction) {
      return null;
    }

    return transaction;
  }

  async getUserTransactions(filter: string): Promise<Transaction[]> {
    const transaction = await this.connection<Transaction>("transactions")
      .where("id", filter)
      .orWhere("sender", filter)
      .orWhere("receiver", filter);

    return transaction;
  }

  async create(transaction: TTransaction): Promise<void> {
    await this.connection<Transaction>("transactions").insert(transaction);
    return;
  }
}
