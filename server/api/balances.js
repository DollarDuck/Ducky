const router = require('express').Router()
const {Balance} = require('../db/models')
module.exports = router

router.get('/:userId', async (req, res, next) => {
  try {
    const balances = await Balance.findAll({
      where: {userId: req.params.userId}
    })
    res.json(balances)
  } catch (err) {
    next(err)
  }
})
