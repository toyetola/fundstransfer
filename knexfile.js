// Update with your config settings.
// @ts-nocheck


/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const dotenv = require('dotenv')
dotenv.config()

module.exports = {

  development: {
    client: 'mysql',
    connection: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    },
    migrations: {
      directory:  __dirname + '/src/db/migrations',
    },
    seeds: {
      directory:  __dirname + '/src/db/seeds',
    }
  },

  staging: {
    client: 'mysql',
    connection: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.TEST_DATABASE_NAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/src/db/migrations',
    },
    seeds: {
      directory:  __dirname + '/src/db/seeds',
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/src/db/migrations',
    },
    seeds: {
      directory:  __dirname + '/src/db/seeds',
    }
  }

};
