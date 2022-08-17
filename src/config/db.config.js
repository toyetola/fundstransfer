// @ts-nocheck

const dotenv = require('dotenv');

dotenv.config()

const knex = require('knex')
const config = require('../../knexfile')['development']
const db = knex(config)

// module.exports = db
export { db };