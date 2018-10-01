import axios from 'axios'

const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS'
const GOT_BANKS = 'GOT_BANKS'

const gotBanks = banks => ({type: GOT_BANKS, banks})
const gotInitialTransactions = transactions => ({type: GOT_TRANSACTIONS, transactions})

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
    default:
      return state
  }
}
