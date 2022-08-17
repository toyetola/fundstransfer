//@ts-nocheck
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('wallets', function name(table) {
            table.increments()
            table.integer('user_id').unsigned()
            table.foreign('user_id').references("users.id").onDelete('CASCADE')
            table.float('balance').defaultTo(0.0)
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').nullable()
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('wallets')
};
