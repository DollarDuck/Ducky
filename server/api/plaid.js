const router = require('express').Router()
const {AccessToken, Transaction, Balance} = require('../db/models')
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

router.get('/allTransactions/:userId', async (req, res, next) => {
  const transactions = await Transaction.findAll({
    where: {
      userId: req.params.userId
    }
  })
  res.json(transactions)
})


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

router.get('/bankInfo/:userId', async (req, res, next) => {
  const accountInfo = await Balance.findAll({
    where: {
      userId: req.params.userId
    }
  })
  console.log('account info', accountInfo)
  let accounts = []
  for(let i = 0; i < accountInfo.length; ++i) {
    accounts.push({text: accountInfo[i].dataValues.name, value: accountInfo[i].dataValues.accountId})
  }
  res.json(accounts)
})

router.post('/transactionsbyBank/:userId', async (req, res, next) => {
  const accountId = req.body.accountId
  console.log('req body', req.body)
  console.log('userId', req.params.userId)
  const transactions = await Transaction.findAll({
    where: {
      accountId: accountId,
      userId: req.params.userId
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
  console.log('transactions here', transactions)
  let returnTransactions = []
  for (let i = 0; i < transactions.length; ++i) {
    let currentTransaction = transactions[i]
    let transaction = await Transaction.findOrCreate({
      where: {
      name: currentTransaction.name,
      amount: currentTransaction.amount,
      userId: req.body.userId,
     accountId: currentTransaction.account_id

    },
    defaults: {
      date: currentTransaction.date,
    }})
    if(transaction.dataValues) returnTransactions.push(transaction.dataValues)
  }
  res.json(returnTransactions)
})

router.post('/balances/:userId', async (req, res, next) => {
  const userId = req.params.userId
  try {
    console.log('user', req.session)
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
  console.log('BALANCES SAVING')
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
        type: currentBalance.type,
        accountId: currentBalance.account_id
    },
    defaults: {
      userId: req.body.userId,
    }})
    if(balance.dataValues) returnBalances.push(balance.dataValues)
  }
  res.json(returnBalances)
})
