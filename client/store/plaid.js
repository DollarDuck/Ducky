import axios from 'axios'

const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS'

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
<<<<<<< HEAD
  console.log(transactions)
  const transactionsInDB = await axios.post('/api/plaid/saveTransactions', {transactions: transactions})
=======
  const transactionsInDB = await axios.post('/api/plaid/saveTransactions', {transactions: transactions, userId: userId})
>>>>>>> 109e44d3091ef8dea34633cf7652d541ef23af7c
  dispatch(gotInitialTransactions(transactionsInDB.data))
 } catch (err) {
   console.error(err)
 }
}

export default function(state = [], action) {
  switch (action.type) {
    case GOT_TRANSACTIONS:
      return action.transactions
    default:
      return state
  }
}
