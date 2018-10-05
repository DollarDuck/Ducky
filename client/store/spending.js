import axios from 'axios'

const GOT_SPENDING = 'GOT_SPENDING'

const gotSpending = spending => ({type: GOT_SPENDING, spending})

export const getSpending = (userId, currentMonth, currentYear, budgetItems) => {
  return async dispatch => {
    const spendingArray = await axios.post(`/api/mtdspending/${userId}`, {currentMonth: currentMonth, currentYear: currentYear})
    let spendingArraySorted = []
    budgetItems.forEach(budgetItem => {
      spendingArraySorted.push(spendingArray.data.find((spendingElement) => {
        return (spendingElement.budgetItemId === budgetItem.id)
      }))
    })
    spendingArraySorted = spendingArraySorted.map(element => {
      return (element ? element.amount : '0')
    })
    dispatch(gotSpending(spendingArraySorted))
  }
}

export default function(state = [], action) {
  switch (action.type) {
    case GOT_SPENDING:
      return action.spending
    default:
      return state
  }
}