import { ResponseObj } from "../types/types";
import { Response } from "express";
import { RequestWithPayload } from "../types/types";
import BaseController from "./BaseController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import Account from "../models/account";
import TransactionValidator from "../validators/TransactionValidator";
import AccountService from "../services/AccountService";
import UserService from "../services/UserService";

export class AccountController extends BaseController {
  constructor(
    private accountService: AccountService,
    private userService: UserService
  ) {
    super();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.put(
      "/fund",
      AuthMiddleware.authenticate,
      this.fundAccount.bind(this)
    );
    this.router.put(
      "/transfer",
      AuthMiddleware.authenticate,
      this.transferFundsToUser.bind(this)
    );
    this.router.put(
      "/withdraw-funds",
      AuthMiddleware.authenticate,
      this.withdrawFund.bind(this)
    );
  }

  async fundAccount(
    req: RequestWithPayload,
    res: Response<ResponseObj>
  ): Promise<void> {
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
      let account: Account | null;
      account = await this.accountService.findAccount(req.userId!);
      if (!account) {
        await this.accountService.createAccount(
          new Account(undefined, req.userId!)
        );
        account = await this.accountService.findAccount(req.userId!);
      }
      await this.accountService.fundAccount(account?.user_id!, req.body.amount);
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

  async transferFundsToUser(
    req: RequestWithPayload,
    res: Response<ResponseObj>
  ): Promise<void> {
    const validationErrors = TransactionValidator.validateTransferInputs(
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
      const foundSenderAccount = await this.accountService.findAccount(
        req.userId!
      );
      if (!foundSenderAccount) {
        res.statusCode = 400;
        res.json({
          message: "Sender does not exist",
          success: false,
        });
        return;
      }

      if (foundSenderAccount.balance < req.body.amount) {
        res.statusCode = 400;
        res.json({
          message: "insufficient funds",
          success: false,
        });
        return;
      }

      const foundReceiverAccount = await this.accountService.findAccount(
        req.body.receiver
      );
      if (!foundReceiverAccount) {
        res.statusCode = 400;
        res.json({
          message: "Receiver does not exist",
          success: false,
        });
        return;
      }

      const receiver = await this.userService.findUser(
        foundReceiverAccount.user_id
      );

      if (foundSenderAccount.id === foundReceiverAccount.id) {
        res.statusCode = 400;
        res.json({
          message: "you can not tranfer funds to yourself",
          success: false,
        });
        return;
      }

      await this.accountService.transferFunds({
        sender: foundSenderAccount.user_id,
        receiver: foundReceiverAccount.user_id,
        amount: req.body.amount,
        type: "transfer",
      });

      res.statusCode = 201;
      res.json({
        message: `transfer to ${receiver?.name} was successful`,
        success: true,
      });
    } catch (error: any) {
      console.error(error);
      res.statusCode = 400;
      res.json({
        message: error.message,
        success: false,
      });
      return;
    }
  }

  async withdrawFund(
    req: RequestWithPayload,
    res: Response<ResponseObj>
  ): Promise<void> {
    const validationErrors = TransactionValidator.validateTransactionInputs(
      req.body
    );
    if (validationErrors.length > 0) {
      res.statusCode = 400;
      res.json({
        message: "Validation Error",
        success: false,
      });
      return;
    }
    try {
      const userBalance = await this.accountService.getCurrentBalance(
        req.userId!
      );
      if (userBalance < req.body.amount) {
        res.statusCode = 400;
        res.json({
          message: "insufficient funds",
          success: false,
        });
        return;
      }
      const newBalance = userBalance - req.body.amount;

      await this.accountService.issueWithdrawal(req.userId!, newBalance);
      res.statusCode = 201;
      res.json({
        message: "Withdrawal issued and successful",
        success: true,
      });
      return;
    } catch (error: any) {
      console.error(error);
      res.statusCode = 500;
      res.json({
        message: error.message,
        success: false,
      });
      return;
    }
  }
}
