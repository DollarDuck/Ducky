const router = require('express').Router()
const {Budget, BudgetItems, Category} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const budget = await Budget.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(budget)
  } catch (err) {
    next(err)
  }
})

router.post('/:userId', async (req, res, next) => {
  console.log('create budget api')
  console.log(req.body)
  const {desiredSavings, income, userId} = req.body
  const DBincome = Number(income)
  const amount = Number(desiredSavings)
  const percentSaved = Math.round(100*Number(desiredSavings)/Number(income))
  console.log(amount, DBincome, percentSaved, userId)

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

router.get('/CatIdByName', async(req, res, next) => {
  const {catName} = req.body

  try {
    const catId = await Category.findOne({
      where: {
        name: "Food and Drink"
      }
    })
    console.log(catId)
    res.json(catId.dataValues.id)
  } catch (err) {
    next(err)
  }
})

// router.post('/budgetItem/:categoryId/:amount/'), async(req, res, next) {}
