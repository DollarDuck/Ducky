import axios from 'axios'

const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS'
const GOT_BANKS = 'GOT_BANKS'
const GOT_ACCOUNT_BALANCES = 'GOT_ACCOUNT_BALANCES'


const gotBanks = banks => ({type: GOT_BANKS, banks})
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
  console.log('transactions', res.data)
  const transactions = res.data
  const transactionsInDB = await axios.post('/api/plaid/saveTransactions', {transactions: transactions, userId: userId})
  dispatch(gotInitialTransactions(transactionsInDB.data))
 } catch (err) {
   console.error(err)
 }
}


export const getAllBanks = (userId) => {
      console.log('here', userId)
  return async dispatch => {
    let res = await axios.get(`/api/plaid/banks/${userId}`)
    dispatch(gotBanks(res.data))
}
}
export const getBalances = (userId, token, institutionName) => async dispatch => {
  try {
    console.log('balance thunk')
    if(token && institutionName) {
      await axios.post('/api/plaid/saveToken', {token: token, institution: institutionName, userId: userId})
    }
    await axios.get(`/api/plaid/userTokens/${userId}`)
    const res = await axios.post(`/api/plaid/balances/${userId}`)
    console.log('balances', res.data)
    const balances = res.data
    const balancesInDB = await axios.post('/api/plaid/saveBalances', {balances: balances, userId: userId})
    console.log('about to dipsatch balances')
    console.log(balancesInDB)
    dispatch(gotInitialAccountBalances(balancesInDB.data))
  } catch(err) {
    console.error(err)
>>>>>>> master
  }
}


<<<<<<< HEAD
export const getTransactionsByBank = (userId, bank) => {
  return async dispatch => {
    let res = await axios.get(`/api/plaid/transactionsbyBank/${userId}`, {bank: bank})
    dispatch(gotInitialTransactions(res.data))
  }
}

export const getTransactionsByUser = (userId) => {
  return async dispatch => {
    let res = await axios.get(`/api/plaid/allTransactions/${userId}`)
    console.log('res', res)
    dispatch(gotInitialTransactions(res.data))
  }
}

export default function(state = {transactions: [], banks: []}, action) {
  switch (action.type) {
    case GOT_TRANSACTIONS:
      return {...state, transactions: action.transactions}
    case GOT_BANKS:
      return {...state, banks: action.banks}
=======
export default function(state = [], action) {
  switch (action.type) {
    case GOT_TRANSACTIONS:
      return action.transactions
    case GOT_ACCOUNT_BALANCES:
      return action.balances
>>>>>>> master
    default:
      return state
  }
}
