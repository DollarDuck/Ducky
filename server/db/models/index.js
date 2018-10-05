const User = require('./user')
const Bill = require('./bills')
const Budget = require('./budget')
const BudgetItems = require('./budgetItems')
const Category = require('./categories')
const Spending = require('./spending')
const AccessToken = require('./access')
const Transaction = require('./transactions')
const Purchase = require('./purchases')
const Balance = require('./balances')
const MtdSpending = require('./mtdSpending')


/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */

Spending.belongsTo(User)
User.hasMany(Spending)

Spending.belongsTo(Category)
Category.hasMany(Spending)

BudgetItems.belongsTo(Budget)
Budget.hasMany(BudgetItems)

Budget.belongsTo(User)
User.hasOne(Budget)

BudgetItems.belongsTo(Category)
Category.hasMany(BudgetItems)


AccessToken.belongsTo(User)
User.hasMany(AccessToken)

Transaction.belongsTo(User)
User.hasMany(Transaction)

Transaction.belongsTo(Category)
Category.hasMany(Transaction)

Balance.belongsTo(User)
User.hasMany(Balance)

Purchase.belongsTo(User)
User.hasMany(Purchase)


Bill.belongsTo(User)
User.hasMany(Bill)

MtdSpending.belongsTo(BudgetItems)
BudgetItems.hasMany(MtdSpending)

MtdSpending.belongsTo(Category)
Category.hasMany(MtdSpending)

MtdSpending.belongsTo(User)
User.hasMany(MtdSpending)

module.exports = {
  User,
  Bill,
  Budget,
  BudgetItems,
  Category,
  Spending,
  AccessToken,
  Transaction,
  Purchase,
  Balance,
  MtdSpending
}
