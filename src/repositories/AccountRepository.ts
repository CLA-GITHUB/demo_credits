import Database from "../db/database";
import Account from "../models/account";
import Transaction from "../models/transaction";
import TransactionRepository from "./TransactionRepository";

export default class AccountRepository extends Database {
  constructor() {
    super();
  }

  async getAccount(filter: string): Promise<Account | null> {
    const account = await this.connection<Account>("accounts")
      .where("id", filter)
      .orWhere("user_id", filter)
      .orWhere("account_number", filter)
      .first();

    if (!account) {
      return null;
    }

    return account;
  }

  async createAccount(account: Account) {
    await this.connection<Account>("accounts").insert(account);
    return;
  }

  async getCurrentBalance(userId: string): Promise<number> {
    const balance = await this.connection<Account>("accounts")
      .where("user_id", userId)
      .select("balance");
    return balance[0].balance!;
  }

  async fundAccount(userId: string, amount: number): Promise<void> {
    const transactionRepository = new TransactionRepository();
    // get the current balance
    const currentBalance = await this.getCurrentBalance(userId);

    const transactionProvider = this.connection.transactionProvider();
    const transaction = await transactionProvider();

    await transaction<Account>("accounts")
      .where("user_id", userId)
      .update({
        balance: currentBalance + amount,
      });

    await transaction<Transaction>("transactions").insert({
      receiver: userId,
      sender: "",
      amount,
      type: "deposit",
    });

    await transaction.commit();

    return;
  }

  async transferFunds({
    sender,
    receiver,
    amount,
    type,
  }: {
    sender: string;
    receiver: string;
    amount: number;
    type: string;
  }): Promise<void> {
    const sendersBalance = await this.getCurrentBalance(sender);
    const receiversBalance = await this.getCurrentBalance(receiver);
    const transactionProvider = this.connection.transactionProvider();
    const transaction = await transactionProvider();

    await transaction<Account>("accounts")
      .where("user_id", sender)
      .update({
        balance: sendersBalance - amount,
      });

    await transaction<Account>("accounts")
      .where("user_id", receiver)
      .update({
        balance: receiversBalance + amount,
      });

    await transaction<Transaction>("transactions").insert({
      receiver,
      sender,
      amount,
      type,
    });

    await transaction.commit();
    return;
  }

  async withdrawFunds(userId: string, amount: number): Promise<void> {
    const transactionRepository = new TransactionRepository();

    await this.connection<Account>("accounts")
      .where("user_id", userId)
      .update("balance", amount);
    await transactionRepository.create({
      amount,
      type: "withdrawal",
      sender: userId,
    });
  }
}
