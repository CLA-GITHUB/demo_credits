import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();
// Update with your config settings.

const extension =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"
    ? "js"
    : "ts";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: process.env.DEV_DB_PATH!,
    },
    migrations: {
      directory: "./src/db/migrations",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "mysql2",
    connection: {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: process.env.DB_PORT as unknown as number,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/db/migrations",
      extension: extension,
      loadExtensions: [`.${extension}`],
    },
    debug: true,
    useNullAsDefault: true,
  },
};
export default config;
