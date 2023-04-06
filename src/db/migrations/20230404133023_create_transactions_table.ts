import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  let uuidGenerationRaw =
    knex.client.config.client === "sqlite3"
      ? `(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`
      : `(UUID())`;
  return knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw(uuidGenerationRaw));
    table.double("amount").notNullable();
    table.uuid("receiver").references("id").inTable("accounts").nullable();
    table.uuid("sender").references("id").inTable("accounts").nullable();
    table.enum("type", ["transfer", "deposit", "withdrawal"]).notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("transactions");
}
