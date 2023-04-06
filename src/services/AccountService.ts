import Account from "../models/account";
import AccountRepository from "../repositories/AccountRepository";

export default class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async createAccount(account: Account): Promise<void> {
    await this.accountRepository.createAccount(account);
  }

  async findAccount(filter: string): Promise<Account | null> {
    return await this.accountRepository.getAccount(filter);
  }

  async fundAccount(userId: string, amount: number): Promise<void> {
    await this.accountRepository.fundAccount(userId, amount);
  }

  async issueWithdrawal(userId: string, amount: number): Promise<void> {
    await this.accountRepository.withdrawFunds(userId, amount);
  }

  async getCurrentBalance(userId: string): Promise<number> {
    return this.accountRepository.getCurrentBalance(userId);
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
    await this.accountRepository.transferFunds({
      sender,
      receiver,
      amount,
      type,
    });
  }
}
