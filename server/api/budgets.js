const router = require('express').Router()
const {Budget, BudgetItems, Category} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const budget = await Budget.findAll({})
    res.json(budget)
  } catch (err) {
    next(err)
  }
})


router.get('/:userId', async (req, res, next) => {
  try {
    const budget = await Budget.findAll({
      where: {
        userId: req.params.userId
      },
      include: [BudgetItems]
    })
    res.json(budget)
  } catch (error) {
    next(error)
  }
})

router.put('/updateAmount', async (req, res, next) => {
  const {budgetId, amount} = req.body
  try {
    const updatedBudget = await Budget.update({
      amount: amount
    }, {
      where: {
        id: budgetId
      }
    })
    res.json(updatedBudget)
  } catch (error) {
    next(error)
  }
})

router.put('/budgetItems/updateAmount', async (req, res, next) => {
  const {budgetId, amount, categoryId} = req.body
  console.log('req.body', budgetId, amount, categoryId)
  try {
    const updatedBudget = await BudgetItems.update({
      amount: amount
    }, {
      where: {
        budgetId: budgetId,
        categoryId: categoryId
      },
      returning: true
    })
    res.json(updatedBudget)
  } catch (error) {
    next(error)
  }
})

router.put('/budgetItem/other', async (req, res, next) => {
  const {budgetId, amountDec, categoryId} = req.body
  console.log('req.body', req.body)
  const budget = await BudgetItems.findOne({where: {
    budgetId: budgetId,
    categoryId: categoryId
  }})
  console.log('budget found', budget)
  const updatedAmount = Number(budget.dataValues.amount) - Number(amountDec)
  console.log('updatedAmount', updatedAmount)
  const newBudget = await BudgetItems.update({
    amount: updatedAmount
  }, {
    where: {
      id: budget.dataValues.id
    },
    returning: true
  })
  res.json(newBudget)
})

router.post('/', async (req, res, next) => {
  const {desiredSavings, income, userId} = req.body
  const DBincome = Number(income)
  const amount = Number(desiredSavings)
  const percentSaved = Math.round(100*Number(desiredSavings)/Number(income))

  try {
    const budget = await Budget.create({
      amount: amount,
      income: DBincome,
      percentSaved: percentSaved,
      mtdSpending: 0,
      userId: userId
    })
    res.json(budget)

  } catch (err) {
    next(err)
  }
})

router.get('/allCategories', async(req, res, next) => {
  try {
    const categories = await Category.findAll()
    res.json(categories)
  }
  catch (err) {
    next(err)
  }
})

router.get('/CatIdByName/:catName', async(req, res, next) => {
  try {
    const catId = await Category.findOne({
      where: {
        name: req.params.catName
      }
    })
    res.json(catId.dataValues.id)
  } catch (err) {
    next(err)
  }
})

router.post('/initialItem/', async(req, res, next) => {
  const {categoryId, amount, mtdSpending, budgetId} = req.body
  try {
    const newBudgetItem = await BudgetItems.create({
      categoryId: Number(categoryId),
      amount: Number(amount),
      mtdSpending: Number(mtdSpending),
      budgetId: Number(budgetId)
    })
    res.send(newBudgetItem)
  } catch (err) {
    next(err)
  }
})

router.put('/budgetItems/:categoryId', async (req, res, next) => {
  try {
    const {billAmount, userId, addBill} = req.body
    const {dataValues} = await Budget.findOne({where: {userId}})

    const [budgetItem, wasCreated] = await BudgetItems.findOrCreate({where: {categoryId: req.params.categoryId, budgetId: dataValues.id}, defaults: {amount: billAmount}})

    if (!wasCreated && addBill) {
      const [numRows, newBudget] = await BudgetItems.update({amount: Number(budgetItem.amount) + Math.floor(Number(billAmount))}, {where: {categoryId: 1, budgetId: dataValues.id}, returning: true, plain: true})
      res.json(newBudget)
    } else {
      res.json(budgetItem)
    }
  } catch (err) {
    next(err)
  }
})
