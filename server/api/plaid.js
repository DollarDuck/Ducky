const router = require('express').Router()
const {AccessToken, Transaction, Balance, Category} = require('../db/models')
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
        userId: req.body.userId,
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
    try {
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
})

router.post('/saveTransactions', async (req, res, next) => {
  const transactions = req.body.transactions
  let returnTransactions = []
  for (let i = 0; i < transactions.length; ++i) {
    console.log('here!')
    let currentTransaction = transactions[i]
    let category = await Category.findOrCreate({
      where: {
        name: currentTransaction.category[0]
      }
    })
    console.log('category', category)
    console.log('id?', category[0].dataValues)
    let transaction = await Transaction.findOrCreate({
      where: {
      name: currentTransaction.name,
      amount: currentTransaction.amount,
    },
    defaults: {
      userId: req.body.userId,
      date: currentTransaction.date,
      accountId: currentTransaction.account_id,
      categoryId: category[0].dataValues.id
    }})
    if(transaction.dataValues) returnTransactions.push(transaction.dataValues)
  }
  res.json(returnTransactions)
})

router.post('/balances/:userId', async (req, res, next) => {
  const userId = req.params.userId
  try {
    const tokens = req.session.accessTokens
    let balances = [];
    for (let i = 0; i < tokens.length; ++i) {
      let currentToken = tokens[i].token
      await client.getBalance(
        currentToken,
        function(error, balanceResponse) {
          if (error) {
            next(error)
          } else {
            balances = balances.concat(balanceResponse.accounts)
            if (i === tokens.length - 1) {
              res.json(balances)
            }
          }
        }
      )
    }
  } catch (error) {
    console.error(error)
  }
})


router.post('/saveBalances', async (req, res, next) => {
  const balances = req.body.balances
  let returnBalances = []
  for (let i = 0; i < balances.length; ++i) {
    let currentBalance = balances[i]
    let balance = await Balance.findOrCreate({
      where: {
        amount: currentBalance.balances.current,
        amountAvailable: currentBalance.balances.available,
        name: currentBalance.name,
        officialName: currentBalance.official_name,
        subtype: currentBalance.subtype,
        type: currentBalance.type
    },
    defaults: {
      userId: req.body.userId,
      accountId: currentBalance.account_id
    }})
    if(balance.dataValues) returnBalances.push(balance.dataValues)
  }
  res.json(returnBalances)
})
