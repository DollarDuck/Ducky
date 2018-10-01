import axios from 'axios'

const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS'
const GOT_BANKS = 'GOT_BANKS'
const GOT_ACCOUNT_BALANCES = 'GOT_ACCOUNT_BALANCES'


const gotBankInfo = accounts => ({type: GOT_BANKS, accounts})
const gotInitialTransactions = transactions => ({type: GOT_TRANSACTIONS, transactions})

const gotInitialAccountBalances = balances => ({type: GOT_ACCOUNT_BALANCES, balances})


export const getTransactions = (userId, lastUpdateDate, token, institutionName) => async dispatch => {
 try {
  console.log('here though')
  if(token && institutionName) {
    await axios.post('/api/plaid/saveToken', {token: token, institution: institutionName, userId: userId})
  }
  await axios.get(`/api/plaid/userTokens/${userId}`)
  const res = await axios.post(`/api/plaid/transactions/${userId}`, {lastUpdateDate: lastUpdateDate})
  const transactions = res.data
  const transactionsInDB = await axios.post('/api/plaid/saveTransactions', {transactions: transactions, userId: userId})
  dispatch(gotInitialTransactions(transactionsInDB.data))
 } catch (err) {
   console.error(err)
 }
}


export const getAllBankInfo = (userId) => {
  console.log('here')
  return async dispatch => {
    let res = await axios.get(`/api/plaid/bankInfo/${userId}`)
    dispatch(gotBankInfo(res.data))
}
}
export const getBalances = (userId, token, institutionName) => async dispatch => {
  try {
    if(token && institutionName) {
      await axios.post('/api/plaid/saveToken', {token: token, institution: institutionName, userId: userId})
    }
    await axios.get(`/api/plaid/userTokens/${userId}`)
    const res = await axios.post(`/api/plaid/balances/${userId}`)
    const balances = res.data
    console.log('balances here', balances)
    const balancesInDB = await axios.post('/api/plaid/saveBalances', {balances: balances, userId: userId})
    dispatch(gotInitialAccountBalances(balancesInDB.data))
  } catch(err) {
    console.error(err)
  }
}


export const getTransactionsByBank = (userId, accountId) => {
  return async dispatch => {
    console.log('account Id', accountId)
    let res = await axios.post(`/api/plaid/transactionsbyBank/${userId}`, {accountId: accountId})
    dispatch(gotInitialTransactions(res.data))
  }
}

export const getTransactionsByUser = (userId) => {
  return async dispatch => {
    let res = await axios.get(`/api/plaid/allTransactions/${userId}`)
    dispatch(gotInitialTransactions(res.data))
  }
}

export default function(state = {transactions: [], accounts: [], balances: []}, action) {
  switch (action.type) {
    case GOT_TRANSACTIONS:
      return {...state, transactions: action.transactions}
    case GOT_BANKS:
      return {...state, accounts: action.accounts}
    case GOT_ACCOUNT_BALANCES:
      return {...state, balances: action.balances}
    default:
      return state
  }
}
