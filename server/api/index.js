const router = require('express').Router()
module.exports = router
// const bodyParser = require('body-parser')

// router.use(bodyParser.urlencoded({
//   extended: false
// }));
// router.use(bodyParser.json());

router.use('/users', require('./users'))
router.use('/plaid', require('./plaid'))
router.use('/bills', require('./bills'))
router.use('/balances', require('./balances'))


// router.use('/budgets', require('./budgets'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
