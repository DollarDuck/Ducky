const router = require('express').Router()
const {Bill} = require('../db/models')
module.exports = router

router.get('/:userId', async (req, res, next) => {
  try {
    const bills = await Bill.findAll({
      where: {userId: req.params.userId}
    })
    res.json(bills)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {name, type, recurring, dueDate, userId} = req.body
    const bill = await Bill.create({name, type, recurring, dueDate, userId})
    res.json(bill)
  } catch (err) {
    next(err)
  }
})
