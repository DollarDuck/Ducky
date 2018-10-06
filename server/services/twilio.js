const {Bill, MtdSpending, BudgetItems, Transaction} = require('../db/models')
const {getCategoryName} = require('../../utils')
const Op = require('sequelize').Op

const billQuery = async user => {
  try {
      const bills = await Bill.findAll({
        where: {userId: user.id, paid: false}
      })
      console.log('bills', bills)
      if (!bills.length) {
        return ['You have no unpaid bills. Good job!']
      }
      else {
        const dueBills = []
        bills.forEach(bill => dueBills.push(`You have a bill due to ${bill.name} on ${bill.dueDate} for $${bill.amount}.`))
        return dueBills
      }
    } catch (err) {
      console.error(err)
    }
}

const budgetQuery = async user => {
  const date = new Date()
  try {
    const budgets = await MtdSpending.findAll({
      where: {userId: user.id, month: date.getMonth(), year: date.getFullYear()}, include: [BudgetItems]
    })
    const budgetPercents = []
    budgets.forEach(budget => {
      const percent = Math.ceil(budget.amount / budget.budgetItem.amount)
      budgetPercents.push(`You are at ${percent}% of your budget for ${getCategoryName(budget.categoryId)} for this month.`)
    })
    return budgetPercents

  } catch (err) {
    console.error(err)
  }
}

const spendingQuery = async (user, userMessage) => {
  let date = new Date().getMonth() + 1
  date = '2018-' + date + '-01'
  try {
    const spending = await Transaction.findAll({
      where: {userId: user.id, name: { $iLike: `${userMessage}%`}, date: { $gte: date}}
    })
    console.log('spending', spending)
    let total = 0
    spending.forEach(transaction => {
      total += Number(transaction.amount)
    })
    if (total > 0) {
      return [`You have spent $${total} at ${userMessage} this month.`]
    } else {
      return ["I couldn't find any transactions for that business this month."]
    }

  } catch (err) {
    console.error(err)
  }
}

module.exports = {billQuery, budgetQuery, spendingQuery}
