interface IValidateAuthInput {
  name?: string;
  email: string;
  password: string;
}

export default class AuthValidator {
  public static validateSignupInputs({
    name,
    email,
    password,
  }: IValidateAuthInput): string[] {
    let errors: string[] = [];
    if (!name) {
      errors.push("name is required");
    }

    if (!password) {
      errors.push("password is required");
    } else if (password.length < 6) {
      errors.push("try a longer password, make it unguessable");
    }

    if (!email) {
      errors.push("email is required");
    } else if (!this.isValidEmail(email)) {
      errors.push("invalid email address");
    }
    return errors;
  }

  public static validateLoginInputs({
    email,
    password,
  }: IValidateAuthInput): string[] {
    let errors: string[] = [];
    if (!email) {
      errors.push("email is required");
    }

    if (!password) {
      errors.push("password is requried");
    }

    return errors;
  }

  private static isValidEmail(email: string): boolean {
    // This is a simplified email validation, it's recommended to use a proper library instead
    return /\S+@\S+\.\S+/.test(email);
  }
}
