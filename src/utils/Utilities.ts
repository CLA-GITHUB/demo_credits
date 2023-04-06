import { Response } from "express";
import { sign } from "jsonwebtoken";

export default class Utilities {
  public static generateAccountNumber(): string {
    let sequence = "";

    for (let i = 0; i < 10; i++) {
      sequence += Math.floor(Math.random() * 10);
    }

    return sequence;
  }

  public static generateToken(payload: any, secret: string): string {
    return sign(payload, secret);
  }

  public static createTokenCookie(res: Response, token: string): void {
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
      path: "/",
    });
    return;
  }

  public static deleteTokenCookie(res: Response): void {
    res.clearCookie("token");
  }
}
