import express, { Application } from "express";
import dotenv from "dotenv";
import cookies from "cookie-parser";
import bodyParser from "body-parser";
import { AuthController } from "./controllers/AuthController";
import UserController from "./controllers/UserController";
import { AccountController } from "./controllers/AccountController";
import AccountRepository from "./repositories/AccountRepository";
import UserService from "./services/UserService";
import AccountService from "./services/AccountService";
import { TransactionService } from "./services/TransactionService";
import { UserRepository } from "./repositories/UserRepository";
import TransactionRepository from "./repositories/TransactionRepository";
import TransactionController from "./controllers/TransactionController";
import Database from "./db/database";
dotenv.config();

export default class App {
  private app: Application;

  constructor(private readonly port: number) {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.app.use(cookies());
    this.app.use(bodyParser.json());
  }

  private setupRoutes(): void {
    const accountRepository = new AccountRepository();
    const userRepository = new UserRepository();
    const transactionRepository = new TransactionRepository();

    const userService = new UserService(userRepository);
    const accountService = new AccountService(accountRepository);
    const transactionService = new TransactionService(transactionRepository);

    const authController = new AuthController(userService, accountService);
    const userController = new UserController(userService, accountService);
    const accountController = new AccountController(
      accountService,
      userService
    );
    const transactionController = new TransactionController(
      transactionService,
      userService
    );

    this.app.use("/auth", authController.router);
    this.app.use("/user", userController.router);
    this.app.use("/account", accountController.router);
    this.app.use("/transaction", transactionController.router);
  }

  public start(): void {
    // const knex = new Database();
    // knex.dropAllTables();
    this.app.listen(this.port, (): void => {
      console.log(`[⚡]: server running on: `, this.port);
    });
  }
}
