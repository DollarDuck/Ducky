import axios from 'axios'

const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS'

const gotInitialTransactions = transactions => ({type: GOT_TRANSACTIONS, transactions})

export const getTransactions = (userId, lastUpdateDate) => async dispatch => {
 try {
  await axios.get(`/api/plaid/userTokens/${userId}`)
  const res = await axios.post(`/api/plaid/transactions/${userId}`, {lastUpdateDate: lastUpdateDate})
  console.log('transactions', res.data)
  const transactions = res.data
  console.log(transactions)
  const transactionsInDB = await axios.post('/api/plaid/saveTransactions', {transactions: transactions})
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
