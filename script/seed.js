'use strict'

const db = require('../server/db')
const {User, Bill, Category, Budget, Balance, BudgetItems, MtdSpending, Transaction} = require('../server/db/models')

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
  dueDate: '2018-11-01',
  recurring: 'monthly',
  paid: false,
  amount: 65.24,
  userId: 2
}, {
  name: 'Apartments LLC',
  type: 'Rent',
  dueDate: '2018 11 03',
  recurring: 'quarterly',
  paid: false,
  amount: 800,
  userId: 2
}, {
  name: 'The Electric Company',
  type: 'Electric',
  dueDate: '2018 10 23',
  recurring: 'yearly',
  paid: false,
  amount: 32.45,
  userId: 1
}]

const budget = [{
  amount: 450,
  income: 4000,
  percentIncomeSaved: 15,
  mtdSpending: 0,
  userId: 1
}]

const budgetItems = [{
  amount: 1000,
  budgetId: 1,
  categoryId: 1,
},
{
  amount: 400,
  budgetId: 1,
  categoryId: 3,
},
{
  amount: 600,
  budgetId: 1,
  categoryId: 4,
},
{
  amount: 200,
  budgetId: 1,
  categoryId: 6,
},
{
  amount: 200,
  budgetId: 1,
  categoryId: 8,
},
{
  amount: 500,
  categoryId: 9,
  budgetId: 1,
},
{
  amount: 400,
  categoryId: 10,
  budgetId: 1,
},
{
  amount: 700,
  categoryId: 7,
  budgetId: 1,
}]

const transactions = [{
  name: 'Starbucks',
  amount: 7.33,
  date: '2018-10-04',
  accountId: 'Checking Account',
  userId: 1,
  categoryId: 9
},
{
  name: 'KFC',
  amount: 15.33,
  date: '2018-10-03',
  accountId: 'Checking account',
  userId: 1,
  categoryId: 9
},
{
  name: 'Saugatuck State Park',
  amount: 25.00,
  date: '2018-10-07',
  accountId: 'Checking Account',
  userId: 1,
  categoryId: 6
},
{
  name: 'River North Gym',
  amount: 125.00,
  date: '2018-10-09',
  accountId: 'Checking Account',
  userId: 1,
  categoryId: 6
},
{
  name: 'United Airlines',
  amount: 700.00,
  date: '2018-10-01',
  accountId: 'Credit Card',
  userId: 1,
  categoryId: 4
},
{
  name: 'Madewell',
  amount: 277.33,
  date: '2018-10-06',
  accountId: 'Credit Card',
  userId: 1,
  categoryId: 3
},
{
  name: 'Caro Mio Italian Restaurant',
  amount: 70.23,
  date: '2018-10-04',
  accountId: 'Credit Card',
  userId: 1,
  categoryId: 9
},
{
  name: 'Happy Camper Pizzeria',
  amount: 47.33,
  date: '2018-10-04',
  accountId: 'Checking Account',
  userId: 1,
  categoryId: 9
},
{
  name: 'Jack\'s Pumpkin Party',
  amount: 25.33,
  date: '2018-10-04',
  accountId: 'Checking Account',
  userId: 1,
  categoryId: 6
},
{
  name: 'Starbucks',
  amount: 7.33,
  date: '2018-10-04',
  accountId: 'Checking Account',
  userId: 1,
  categoryId: 9
}]


const balances = [{
  amount: 8000,
  amountAvailable: 1000,
  date: '2018-10-04',
  accountId: 'Checking Account',
  name: 'Checking Account',
  officialName: 'Checking Account',
  type: 'depository',
  subtype: 'checking',
  userId: 1
},
{
  amount: 3000,
  amountAvailable: 1000,
  date: '2018-10-04',
  accountId: 'Savings Account',
  name: 'Savings Account',
  officialName: 'Savings Account',
  type: 'depository',
  subtype: 'savings',
  userId: 1
},
{
  amount: 10000,
  amountAvailable: 700,
  date: '2018-10-04',
  accountId: 'Credit Card',
  name: 'Credit Card',
  officialName: 'Credit Card',
  type: 'credit',
  subtype: 'checking',
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
  await Promise.all(budget.map(budgets => Budget.create(budgets)))
  const budgetItemsDB = await Promise.all(budgetItems.map(budgetItem => BudgetItems.create(budgetItem)))
  const mtdSpendings = [{
  amount: 147.55,
  month: '10',
  year: '2018',
  categoryId: 9,
  userId: 1 ,
  budgetItemId: budgetItemsDB[5].dataValues.id
},
{
  amount: 175.33,
  month: '10',
  year: '2018',
  categoryId: 6,
  userId: 1,
  budgetItemId: budgetItemsDB[3].dataValues.id
},
{
  amount: 277.33,
  categoryId: 3,
  month: '10',
  year: '2018',
  userId: 1,
  budgetItemId: budgetItemsDB[1].dataValues.id
},
{
  amount: 700,
  amountAvailable: 500,
  categoryId: 4,
  month: '10',
  year: '2018',
  userId: 1,
  budgetItemId: budgetItemsDB[2].dataValues.id
}]

  await Promise.all(transactions.map(transaction => Transaction.create(transaction)))
  await Promise.all(mtdSpendings.map(mtdSpending => MtdSpending.create(mtdSpending)))
  await Promise.all(balances.map(balance => Balance.create(balance)))

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
