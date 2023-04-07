import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
const { DEV_DB_PATH, DEV_DB_PATH_TEST, NODE_ENV } = process.env;
// Update with your config settings.

const extension =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"
    ? "js"
    : "ts";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename:
        DEV_DB_PATH! ||
        `
C:/Users/TL/Desktop/dev_stuff/demo_credit/src/db/dev.db3
      `,
    },
    migrations: {
      directory:
        NODE_ENV == "production" ? "./src/db/migrations" : "./migrations",
    },
    useNullAsDefault: true,
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: DEV_DB_PATH_TEST!,
    },
    migrations: {
      directory:
        NODE_ENV == "production" ? "./src/db/migrations" : "./migrations",
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
      directory: "./migrations",
      extension: extension,
      loadExtensions: [`.${extension}`],
    },
    debug: true,
    useNullAsDefault: true,
  },
};
export default config;
