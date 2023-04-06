import { AuthMiddleware } from "./../middlewares/AuthMiddleware";
import { Response } from "express";
import { TransactionService } from "../services/TransactionService";
import UserService from "../services/UserService";
import { RequestWithPayload, ResponseObj } from "../types/types";
import BaseController from "./BaseController";

export default class TransactionController extends BaseController {
  constructor(
    private transactionService: TransactionService,
    private userService: UserService
  ) {
    super();
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get(
      "/:transactionId",
      AuthMiddleware.authenticate,
      this.getTransaction.bind(this)
    );
    this.router.get(
      "/",
      AuthMiddleware.authenticate,
      this.getTransactions.bind(this)
    );
  }

  async getTransaction(
    req: RequestWithPayload,
    res: Response<ResponseObj>
  ): Promise<void> {
    if (!req.params.transactionId) {
      res.statusCode = 400;
      res.json({
        message: "transaction id not found",
        success: false,
      });
      return;
    }

    try {
      let transaction = await this.transactionService.findTransaction(
        req.params.transactionId
      );

      //check if user is a sender or receiver of the returned transaction
      if (
        transaction?.sender !== req.userId ||
        transaction?.sender !== req.userId
      ) {
        res.statusCode = 400;
        res.json({
          message: "not your transaction",
          success: false,
        });
        return;
      }

      res.statusCode = 200;
      res.json({
        payload: {
          transaction: transaction || [],
        },
      });
      return;
    } catch (error: any) {
      console.error(error);
      res.statusCode = 500;
      res.json({
        message: error.message,
        success: false,
      });
    }
  }

  async getTransactions(
    req: RequestWithPayload,
    res: Response<ResponseObj>
  ): Promise<void> {
    try {
      const foundUser = await this.userService.findUser(req.userId!);
      if (!foundUser) {
        res.statusCode = 404;
        res.json({
          message: "User not found",
          success: false,
        });
        return;
      }

      const transactions = await this.transactionService.findUserTransactions(
        foundUser.id
      );
      res.statusCode = 200;
      res.json({
        payload: {
          transactions,
        },
      });
    } catch (error: any) {
      console.error(error);
      res.statusCode = 500;
      res.json({
        message: error.message,
        success: false,
      });
    }
  }
}
