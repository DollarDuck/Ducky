import axios from 'axios'

const GOT_BILLS = 'GOT_BILLS'
const ADDED_BILL = 'ADDED_BILL'
const EDITED_BILL = 'EDITED_BILL'

const gotBills = bills => ({type: GOT_BILLS, bills})
const addedBill = bill => ({type: ADDED_BILL, bill})
const editedBill = bill => ({type: EDITED_BILL, bill})

export const getBills = userId => async dispatch => {
  try {
    const { data } = await axios.get(`/api/bills/${userId}`)
    dispatch(gotBills(data))
  } catch (err) {
    console.error(err)
  }
}

export const addBill = bill => async dispatch => {
  try {
    const { data } = await axios.post('/api/bills', bill)
    dispatch(addedBill(data))
  } catch (err) {
    console.error(err)
  }
}

export const editBill = bill => async dispatch => {
  try {
    const { data } = await axios.put(`/api/bills/${bill.id}`, bill)
    dispatch(editedBill(data))
  } catch (err) {
    console.error(err)
  }
}

export default (state = [], action) => {
  switch (action.type) {
    case GOT_BILLS:
      return action.bills
    case ADDED_BILL:
      return [...state, action.bill]
    case EDITED_BILL:
      return [...state.filter(bill => bill.id !== action.bill.id), action.bill]
    default:
      return state
  }
}
