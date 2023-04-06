import { v4 as uuidv4 } from "uuid";
import Utilities from "../utils/Utilities";

export default class Account {
  constructor(
    public id = uuidv4(),
    public user_id: string,
    public account_number = Utilities.generateAccountNumber(),
    public balance = 0
  ) {
    this.balance = balance;
    this.user_id = user_id;
    this.account_number = account_number;
  }
}
