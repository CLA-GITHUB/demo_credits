import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  let uuidGenerationRaw =
    knex.client.config.client === "sqlite3"
      ? `(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`
      : `uuid_generate_v4()`;
  return knex.schema.createTable("accounts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw(uuidGenerationRaw));
    table.string("account_number").notNullable().unique();
    table.double("balance").defaultTo(0.0);

    table.uuid("user_id").unique().references("id").inTable("users");

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTableIfExists("accounts");
  return knex.schema.dropTableIfExists("wallets");
}
