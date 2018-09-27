const router = require('express').Router()
const {AccessToken, Transaction} = require('../db/models')
const axios = require('axios')
module.exports = router
const plaid = require('plaid')

var client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments[process.env.PLAID_ENV],
  {version: '2018-05-22'}
);


router.post('/saveToken', async (req, res, next) => {
	const publicToken = req.body.token
	const bank = req.body.institution
	let accessToken
	let itemId
	await client.exchangePublicToken(publicToken, async function(error, tokenResponse) {
		if(error) {
			next(error)
		}
		else {
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
			res.json(tokens)
		} catch (error) {
			next(error)
		}
})

router.post('/saveTransactions', async (req, res, next) => {
	const transactions = req.body.transactions
	let returnTransactions = []
	for(let i = 0; i < transactions[0].length; ++i) {
		let currentTransaction = transactions[0][i]
		let transaction = await Transaction.create({
			name: currentTransaction.name,
			amount: currentTransaction.amount,
			date: currentTransaction.date,
			accountId: currentTransaction.account_id,
			pending: currentTransaction.pending
		})
		returnTransactions.push(transaction.dataValues)
	}
	res.json(returnTransactions)
})


router.post('/transactions/:userId', async (req, res, next) => {
	const userId = req.params.userId
	console.log('req body', req.body)
	if(parseInt(req.user.id) === parseInt(userId)) {
		try {
			const tokens = req.body.tokens
			const transactions = []
			const today = new Date();
			let dd = today.getDate();
			let mm = today.getMonth()+1; //January is 0!
			let mm2 = mm - 1
			if(dd.toString().length < 2) {
				dd = "0" + dd
			}
			if(mm.toString().length < 2) {
				mm = "0" + mm
			}
			if(mm2.toString().length < 2) {
				mm2 = "0" + mm2
			}
			const yyyy = today.getFullYear();
			const endDate = yyyy+ '-' + mm + '-' + dd
  			const startDate = yyyy+ '-' + mm2 + '-' + dd
			for(let i=0; i<tokens.length; ++i) {
				let currentToken = tokens[i].token
				await client.getTransactions(currentToken, startDate, endDate, {
    				count: 250,
   					offset: 0,
 				}, function(error, transactionsResponse) {
    				if (error) {
      					next(error);
    				} else {
      					transactions.push(transactionsResponse.transactions)
    				}
  				});
			}
			res.json(transactions)
		} catch (error) {
			next(error)
		}
	}
	else {
		res.send('Unauthorized!')
	}
})