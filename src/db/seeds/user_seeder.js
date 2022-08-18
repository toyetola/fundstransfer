/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1, 
      firstname: 'Lola', 
      lastname: 'rowValue1', 
      email: 'test@gmail.com',
      password:'$2b$10$M/9ejAUafINC5Da/9BOq4uuFTRnQJDQn6f8XB9DDMJmx8xQRmaVyS',
      account_number:'3467849533'
    },
    {
      id: 2, 
      firstname: 'Bee', 
      lastname: 'Joe', 
      email: 'test1@gmail.com',
      password:'$2b$10$M/9ejAUafINC5Da/9BOq4uuFTRnQJDQn6f8XB9DDMJmx8xQRmaVyS',
      account_number:'3467849534'
    }
  ]);
};
