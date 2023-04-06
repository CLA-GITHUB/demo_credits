import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { RequestWithPayload, ResponseObj } from "../types/types";

export class AuthMiddleware {
  public static authenticate(
    req: RequestWithPayload,
    res: Response<ResponseObj>,
    next: NextFunction
  ): void {
    const { token } = req.cookies;

    if (!token) {
      res.statusCode = 409;
      res.json({
        message: "unauthorized",
      });
      return;
    }

    try {
      const decode = verify(token, process.env.LOGIN_SECRET!);
      req.userId = (decode as { userId: string }).userId;

      next();
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.json({
        message: "unauthorized",
      });
      return;
    }
  }
}
