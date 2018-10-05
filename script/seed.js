'use strict'

const db = require('../server/db')
const {User, Bill, Category} = require('../server/db/models')

const categories = [{
  name: 'Monthly Expenses',
  id: 1
}, {
  name: 'Other',
  id: 7
}, {
  name: 'Food and Drink',
  id: 9
},
{ name: 'Payment',
id: 2,
},
{name: 'Shops',
id: 3},
{name: 'Travel',
id: 4},
{name: 'Transfer',
id: 5},
{name: 'Recreation',
id: 6},
{name: 'Savings',
id: 8},
{name: 'Big Purchases',
id: 10}]

const bills = [{
  name: 'Chicago Electric',
  type: 'Electric',
  dueDate: '10-23-2018',
  recurring: '',
  paid: true,
  amount: 23.12,
  userId: 1
}, {
  name: 'Chicago Water',
  type: 'Water',
  dueDate: '10-29-2018',
  recurring: 'monthly',
  paid: true,
  amount: 14.69,
  userId: 1
}, {
  name: 'Comcast',
  type: 'Internet',
  dueDate: '11-01-2018',
  recurring: 'monthly',
  paid: false,
  amount: 65.24,
  userId: 2
}, {
  name: 'Apartments LLC',
  type: 'Rent',
  dueDate: '11-03-2018',
  recurring: 'quarterly',
  paid: false,
  amount: 800,
  userId: 2
}, {
  name: 'The Electric Company',
  type: 'Electric',
  dueDate: '11-15-2018',
  recurring: 'yearly',
  paid: false,
  amount: 32.45,
  userId: 1
}]





async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({firstName: 'Cody', lastName: 'Jones', phoneNumber: '6081234567', email: 'cody@email.com', password: '123'}),
    User.create({firstName: 'Murphy', lastName: 'James', phoneNumber: '9732126484', email: 'murphy@email.com', password: '123'})
  ])
  await Promise.all(bills.map(bill => Bill.create(bill)))
  await Promise.all(categories.map(category => Category.create(category)))

  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
