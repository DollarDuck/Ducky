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

router.post('/:userId', async (req, res, next) => {
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

router.post('/initialItem/:categoryId/:amount/:budgetId/:mtdSpending', async(req, res, next) => {
  const {categoryId, amount, mtdSpending, budgetId} = req.params
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

router.put('/:budgetId', async (req, res, next) => {
  try {
    const {} = req.body
    const [numRows, budget] = await Budget.update({paid: paid}, {where: {id: req.params.budgetId}, returning: true, plain: true})
    res.json(budget)
  } catch (err) {
    next(err)
  }
})
