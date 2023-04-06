import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: process.env.DEV_DB_PATH!,
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
    },
    debug: true,
    useNullAsDefault: true,
  },
};
export default config;
