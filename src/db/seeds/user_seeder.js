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
      password:'mypassword',
      account_number:'3467849533'
    }
  ]);
};
