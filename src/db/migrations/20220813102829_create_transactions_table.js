//@ts-nocheck

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('transactions', function name(table) {
            table.increments()
            table.integer('sender_id').unsigned()
            table.foreign('sender_id').references('users.id').onDelete('CASCADE')
            table.integer('receiver_id').unsigned()
            table.foreign('receiver_id').references('users.id').onDelete('CASCADE')
            table.float('amount')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').nullable()
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable("transactions")
};
