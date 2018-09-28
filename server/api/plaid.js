const router = require('express').Router()
const {AccessToken, Transaction} = require('../db/models')
const axios = require('axios')
const plaid = require('plaid')
const {formatDate} = require('../../utils')
module.exports = router

var client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments[process.env.PLAID_ENV],
  {version: '2018-05-22'}
)

router.post('/saveToken', async (req, res, next) => {
  const publicToken = req.body.token
  const bank = req.body.institution
  let accessToken
  let itemId
  await client.exchangePublicToken(publicToken, async function(
    error,
    tokenResponse
  ) {
    if (error) {
      next(error)
    } else {
      accessToken = tokenResponse.access_token
      itemId = tokenResponse.item_id
      const newAccess = await AccessToken.create({
        token: accessToken,
        itemId: itemId,
        userId: req.user.id,
        bank: bank
      })
      res.sendStatus(200)
    }
  })
})

router.get('/transactionsbyBank/:bank', async (req, res, next) => {
  const transactions = await Transaction.findAll({
    where: {
      bank: req.params.bank
    }
  })
  res.json(transactions)
})

router.get('/userTokens/:userId', async (req, res, next) => {
  try {
    const tokens = await AccessToken.findAll({
      where: {
        userId: req.params.userId
      }
    })
    req.session.accessTokens = tokens
    res.sendStatus(201)
  } catch (error) {
    next(error)
  }
})

router.post('/transactions/:userId', async (req, res, next) => {
  const userId = req.params.userId
  const lastUpdateDate = req.body.lastUpdateDate
  if (Number(req.user.id) === Number(userId)) {
    try {
      console.log('user', req.session)
      const tokens = req.session.accessTokens
      const [endDate, startDate] = formatDate(lastUpdateDate)
			let transactions = []
      for (let i = 0; i < tokens.length; ++i) {
        let currentToken = tokens[i].token
        await client.getTransactions(
          currentToken,
          startDate,
          endDate,
          {
            count: 250,
            offset: 0
          },
          function(error, transactionsResponse) {
            if (error) {
              next(error)
            } else {
              transactions = transactions.concat(
                transactionsResponse.transactions
              )
              if (i === tokens.length - 1) {
                res.json(transactions)
              }
            }
          }
        )
      }
    } catch (error) {
      console.error(error)
    }
  } else {
    res.send('Unauthorized!')
  }
})

router.post('/saveTransactions', async (req, res, next) => {
  const transactions = req.body.transactions
  let returnTransactions = []
  for (let i = 0; i < transactions.length; ++i) {
    let currentTransaction = transactions[i]
    let transaction = await Transaction.findOrCreate({
      where: {
      name: currentTransaction.name,
      amount: currentTransaction.amount,
    },
    defaults: {
      date: currentTransaction.date,
      accountId: currentTransaction.account_id
    }})
    console.log('transaction', transaction)
    if(transaction.dataValues) returnTransactions.push(transaction.dataValues)
  }
  res.json(returnTransactions)
})
