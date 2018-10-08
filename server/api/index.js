const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/plaid', require('./plaid'))
router.use('/bills', require('./bills'))
router.use('/balances', require('./balances'))
router.use('/budgets', require('./budgets'))
router.use('/mtdspending', require('./mtdspending'))
router.use('/twilio', require('./twilio'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
