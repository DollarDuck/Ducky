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
    const {name, type, recurring, dueDate, userId, amount} = req.body
    const bill = await Bill.create({name, type, recurring, dueDate, amount, userId})
    res.json(bill)
  } catch (err) {
    next(err)
  }
})

router.put('/updateBillsMonthly', async (req, res, next) => {
  const allBills = req.body.bills
  for(let i = 0; i < allBills.length; ++i) {
    let dueDateMonth = allBills[i].dueDate.slice(5,7)
    let dueDateNewMonth = Number(dueDateMonth) + 1
    if(dueDateNewMonth === 13) {
      dueDateNewMonth=1
    }
    const newDueDate = allBills[i].dueDate.slice(0,5) + dueDateNewMonth.toString() + allBills[i].dueDate.slice(7)
    await Bill.findOrCreate({
      where: {
        name: allBills[i].name,
        type: allBills[i].type,
        dueDate: newDueDate,
        recurring: allBills[i].recurring,
        paid: allBills[i].paid,
        amount: allBills[i].amount,
        userId: req.body.userId
      }
    })
  }
  const bills = await Bill.findAll({ where: {
    userId: req.body.userId
  }})
  res.json(bills)
})

router.put('/:billId', async (req, res, next) => {
  try {
    const {paid} = req.body
    const [numRows, bill] = await Bill.update({paid: paid}, {where: {id: req.params.billId}, returning: true, plain: true})
    res.json(bill)
  } catch (err) {
    next(err)
  }
})

router.delete('/:billId', async (req, res, next) => {
  try {
    await Bill.destroy({where: {id: req.params.billId}})
    res.json(Number(req.params.billId))
  } catch (err) {
    next(err)
  }
})
