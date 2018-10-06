import axios from 'axios'

const GOT_BILLS = 'GOT_BILLS'
const ADDED_BILL = 'ADDED_BILL'
const EDITED_BILL = 'EDITED_BILL'
const DELETED_BILL = 'DELETED_BILL'

const gotBills = bills => ({type: GOT_BILLS, bills})
const addedBill = bill => ({type: ADDED_BILL, bill})
const editedBill = bill => ({type: EDITED_BILL, bill})
const deletedBill = billId => ({type: DELETED_BILL, billId})

export const getBills = userId => async dispatch => {
  try {
    const { data } = await axios.get(`/api/bills/${userId}`)
    dispatch(gotBills(data))
  } catch (err) {
    console.error(err)
  }
}

export const checkMonthly = (billArray, userId) => async dispatch => {
  const updateBills = []
  console.log('bills HERE', billArray)
  billArray.forEach(bill => {
    const dueDate = new Date(bill.dueDate)
    if((dueDate < Date.now()) && (bill.recurring === 'monthly')) {
      updateBills.push(bill)
    }
  })
  console.log('update Bills', updateBills)
  if(updateBills.length) {
    console.log('here')
    const updatedBills = await axios.put(`/api/bills/updateBillsMonthly`, {bills: updateBills, userId: userId})
    dispatch(gotBills(updatedBills.data))
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

export const deleteBill = billId => async dispatch => {
  try {
    const { data } = await axios.delete(`/api/bills/${billId}`)
    console.log('bill data', data)
    dispatch(deletedBill(data))
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
    case DELETED_BILL:
    return [...state.filter(bill => bill.id !== action.billId)]
    default:
      return state
  }
}
