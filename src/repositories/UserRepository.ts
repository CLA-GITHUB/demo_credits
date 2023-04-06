import Database from "../db/database";
import User from "../models/user";
import { TUser } from "../types/types";

export class UserRepository extends Database {
  constructor() {
    super();
  }

  async getUser(filter: string): Promise<User | null> {
    const users = await this.connection<User>("users")
      .where("id", filter)
      .orWhere("email", filter);

    return users[0];
  }

  async create(user: TUser): Promise<User | null> {
    const createdUser = await this.connection<User>("users").insert(user, "*");
    if (!createdUser) {
      return null;
    }
    return createdUser[0];
  }
}
