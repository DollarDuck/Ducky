import axios from 'axios'

const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS'

const gotInitialTransactions = transactions => ({type: GOT_TRANSACTIONS, transactions})

export const getTransactions = userId => async dispatch => {
 try {
  await axios.get(`/api/plaid/userTokens/${userId}`)
  const res = await axios.get(`/api/plaid/transactions/${userId}`)
  const transactions = res.data
  console.log('res', res)
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
