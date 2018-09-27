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
