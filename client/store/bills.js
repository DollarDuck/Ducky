import axios from 'axios'

const GOT_BILLS = 'GOT_BILLS'

const gotBills = bills => ({type: GOT_BILLS, bills})

export const getBills = userId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/bills/${userId}`)
    dispatch(gotBills(data))
  } catch (err) {
    console.error(err)
  }
}

export default (state = [], action) => {
  switch (action.type) {
    case GOT_BILLS:
      return action.bills
    default:
      return state
  }
}
