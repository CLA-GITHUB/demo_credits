import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
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
        process.env.DEV_DB_PATH ||
        "C:\\Users\\USER\\Desktop\\dev stuff\\Node\\be_tasks\\demo_credit\\src\\db\\demo_db.db3",
    },
    migrations: {
      directory: "./src/db/migrations",
    },
    useNullAsDefault: true,
  },

  test: {
    client: "sqlite3",
    connection: {
      filename:
        process.env.DEV_DB_PATH_TEST! ||
        "C:\\Users\\USER\\Desktop\\dev stuff\\Node\\be_tasks\\demo_credit\\src\\db\\test_db.db3",
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
