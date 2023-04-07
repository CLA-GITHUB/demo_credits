import { Response } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import AccountService from "../services/AccountService";
import UserService from "../services/UserService";
import { RequestWithPayload, ResponseObj } from "../types/types";
import TransactionValidator from "../validators/TransactionValidator";
import BaseController from "./BaseController";
import Account from "../models/account";

export default class UserController extends BaseController {
  constructor(
    private userService: UserService,
    private accountService: AccountService
  ) {
    super();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/me", AuthMiddleware.authenticate, this.getMe.bind(this));
    this.router.put(
      "/account/fund",
      AuthMiddleware.authenticate,
      this.fundAccount.bind(this)
    );
  }

  async getMe(
    req: RequestWithPayload,
    res: Response<ResponseObj>
  ): Promise<void> {
    const foundUser = await this.userService.findUser(req.userId!);
    if (!foundUser) {
      res.statusCode = 404;
      res.json({
        message: "user not found",
      });
      return;
    }

    const foundAccount = await this.accountService.findAccount(foundUser?.id!);
    if (!foundAccount) {
      await this.accountService.createAccount(
        new Account(undefined, foundUser.id)
      );
    }

    //remove password form foundUser
    foundUser.password = "";

    res.statusCode = 200;
    res.json({
      payload: {
        user: foundUser,
        account: foundAccount!,
      },
    });
  }

  async fundAccount(
    req: RequestWithPayload,
    res: Response<ResponseObj>
  ): Promise<void> {
    const { amount } = req.body;

    const foundUser = await this.userService.findUser(req.userId!);
    if (!foundUser) {
      res.statusCode = 404;
      res.json({
        message: "user not found",
      });
      return;
    }

    //validate input
    const validationErrors = TransactionValidator.validateTransactionInputs(
      req.body
    );
    if (validationErrors.length > 0) {
      res.statusCode = 400;
      res.json({
        message: "Validation Error",
        success: false,
        errors: validationErrors,
      });
      return;
    }

    try {
      await this.accountService.fundAccount(foundUser.id!, amount);
      res.statusCode = 201;
      res.json({
        message: "Deposit successful",
        success: true,
      });
    } catch (error: any) {
      console.error(error);
      res.statusCode = 500;
      res.json({
        message: error.message,
      });
      return;
    }
  }
}
