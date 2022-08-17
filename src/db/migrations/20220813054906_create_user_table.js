//@ts-nocheck

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('users', function name(table) {
            table.increments()
            table.string('firstname')
            table.string('lastname')
            table.string('email').unique()
            table.string('password').notNullable()
            table.string('account_number', {primary_key:true}).unique()
            table.string('access_token').nullable()
            table.string('role').defaultTo('customer')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').nullable()
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
