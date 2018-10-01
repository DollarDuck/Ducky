import axios from 'axios'

const GOT_DB_BALANCES = 'GOT_DB_BALANCES'

const gotDBBalances = balances => ({type: GOT_DB_BALANCES, balances})

export const getDBBalances = userId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/balances/${userId}`)
    dispatch(gotDBBalances(data))
  } catch (err) {
    console.error(err)
  }
}

export default (state = [], action) => {
  switch (action.type) {
    case GOT_DB_BALANCES:
      return action.balances
    default:
      return state
  }
}
