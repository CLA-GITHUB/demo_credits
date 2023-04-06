import User from "../models/user";
import { UserRepository } from "../repositories/UserRepository";
import { TUser } from "../types/types";

export default class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUser(filter: string): Promise<User | null> {
    return await this.userRepository.getUser(filter);
  }

  async createUser(user: TUser): Promise<User | null> {
    const newUser = await this.userRepository.create(user);

    return newUser;
  }
}
