import request from "supertest";
import { describe, expect, test } from "@jest/globals";
import App from "../../app";

const app = new App(8080).getApp();

describe("Transaction endpoints", () => {
  describe("GET /tranactions", () => {
    it("should all transactions of an authroized user", async () => {
      const res = await request(app)
        .get("/transactions")

        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body).toHaveProperty("payload");
    });

    it("should return 400 if name is missing", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({ password: "password123", email: "test@example.com" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toHaveProperty("message", "Validation error");
      expect(res.body).toHaveProperty("errors", ["name is required"]);
    });

    it("should return 400 if email is missing", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({ password: "password123", name: "test" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toHaveProperty("message", "Validation error");
      expect(res.body).toHaveProperty("errors", ["email is required"]);
    });

    it("should return 400 if password is missing", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({ email: "test@example.com", name: "test" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toHaveProperty("message", "Validation error");
      expect(res.body).toHaveProperty("errors", ["password is required"]);
    });

    it("should return 400 if no values are missing", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({})
        .set("Accept", "application/json")
        .expect("Content-Type", /json/);

      expect(res.body).toHaveProperty("message", "Validation error");
      expect(res.body).toHaveProperty("errors", [
        "name is required",
        "password is required",
        "email is required",
      ]);
    });
  });

  describe("POST /auth/login", () => {
    it("should login a user and return 200", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201);

      expect(res.statusCode).toBe(200);
    });

    it("should return 400 if email is missing", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ password: "password123" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toHaveProperty("message", "Validation error");
      expect(res.body).toHaveProperty("errors", ["email is required"]);
    });

    it("should return 400 if password is missing", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ password: "password123" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toHaveProperty("message", "Validation error");
      expect(res.body).toHaveProperty("errors", ["password is required"]);
    });

    it("should return 400 if credentials are invalid", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "testd@example.com", password: "password12d" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toHaveProperty("message", "invalid email or password");
      expect(res.body).toHaveProperty("sucess", false);
    });

    it("should return 400 if all values are missing", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send()
        .set("Accept", "application/json")
        .expect("Content-Type", /json/);

      expect(res.body).toHaveProperty("message", "Validation error");
      expect(res.body).toHaveProperty("errors", [
        "email is required",
        "password is required",
      ]);
    });
  });
});
