// @ts-nocheck

const dotenv = require('dotenv');

dotenv.config()

const knex = require('knex')
const config = require('../../knexfile')['staging']
const db = knex(config)

module.exports = db;
