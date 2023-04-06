import Transaction from "../models/transaction";
import TransactionRepository from "../repositories/TransactionRepository";
import { TTransaction } from "../types/types";

export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async findTransaction(filter: string): Promise<Transaction | null> {
    return await this.transactionRepository.getTransaction(filter);
  }

  async findUserTransactions(userId: string): Promise<Transaction[]> {
    return await this.transactionRepository.getUserTransactions(userId);
  }

  async createTransaction(transaction: TTransaction): Promise<void> {
    return await this.transactionRepository.create(transaction);
  }
}
