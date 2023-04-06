type TBody = any;

export default class TransactionValidator {
  public static validateTransactionInputs({ amount }: TBody): string[] {
    let errors: string[] = [];

    if (!amount) {
      errors.push("set an amount you will like to fund wallet with");
    } else if (amount < 1) {
      errors.push("amount cannot be less than one");
    }

    return errors;
  }

  public static validateTransferInputs({ receiver, amount }: TBody): string[] {
    let errors: string[] = [];

    if (!receiver) {
      errors.push("receiver not set");
    }

    if (!amount) {
      errors.push("set an amount you will like to fund wallet with");
    } else if (amount < 1) {
      errors.push("amount cannot be less than one");
    }

    return errors;
  }
}
