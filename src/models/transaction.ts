import { v4 as uuidv4 } from "uuid";

// defining the transaction class
export default class Transaction {
  id: string;
  sender?: string;
  receiver?: string;
  amount: number;
  type: string;

  constructor({ amount, sender, receiver, type }: Omit<Transaction, "id">) {
    this.id = uuidv4();
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.type = type;
  }
}
