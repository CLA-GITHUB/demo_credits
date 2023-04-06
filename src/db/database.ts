import knex, { Knex } from "knex";
import config from "./knexfile";

export default class Database {
  protected connection: Knex;

  constructor() {
    this.connection = knex(config[process.env.NODE_ENV!]);
  }

  async close() {
    await this.connection.destroy();
  }

  async makeMigrations() {
    await this.connection.migrate.latest();
  }

  async dropAllTables() {
    this.connection.schema.dropTableIfExists("users");
    this.connection.schema.dropTableIfExists("accounts");
    this.connection.schema.dropTableIfExists("transactions");
  }
}
