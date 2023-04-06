import express, { Router } from "express";

export default class BaseController {
  public router: Router;

  constructor() {
    this.router = express.Router();
  }
}
