import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_BUDGET = 'GET_BUDGET'

/**
 * INITIAL STATE
 */
const defaultBudget = {}

/**
 * ACTION CREATORS
 */


const getBudget = budget => ({type: GET_BUDGET, budget})

export const getBudgetFromServer = userId => {
  return async dispatch => {
    const budget = await axios.get(`/api/budgets/${userId}`)
    dispatch(getBudget(budget.data))
  }
}


export const updateBudgetItems = updateInfo => {
  return async dispatch => {
    console.log('updateInfo', updateInfo)
    await axios.put('/api/budgets/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.totalAmount})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.foodAndDrink, categoryId: 9})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.monthlyExpenses, categoryId: 1})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.shops, categoryId: 3})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.travel, categoryId: 4})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.recreation, categoryId: 6})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.other, categoryId: 7})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.savings, categoryId: 8})
    const newBudget = await axios.get(`/api/budgets/${updateInfo.userId}`)
    dispatch(getBudget(newBudget.data))
    history.push('/home')
  }
}


/**
 * THUNK CREATORS
 */
export const createBudget = (stateChange) => {
  return async (dispatch) => {
    const userId = stateChange.userId
    const response = await axios.post('/api/budgets', stateChange)
    const newBudget = response.data
    const budgetId = newBudget.id
    dispatch(getBudget(newBudget))
    const food = await axios.post('/api/budgets/initialItem', {categoryId: 9, amount: stateChange.food, budgetId: budgetId, mtdSpending: 0})
    const monthlyDB = await axios.post('/api/budgets/initialItem', {categoryId: 1, amount: stateChange.monthlyExpenses, budgetId: budgetId, mtdSpending: 0})
    const shopping = await axios.post('/api/budgets/initialItem', {categoryId: 3, amount: stateChange.shopping, budgetId: budgetId, mtdSpending: 0})
    const travel = await axios.post('/api/budgets/initialItem', {categoryId: 4, amount: stateChange.travel, budgetId: budgetId, mtdSpending: 0})
    const recreation = await axios.post('/api/budgets/initialItem', {categoryId: 6, amount: stateChange.recreation, budgetId: budgetId, mtdSpending: 0})
    const savings = await axios.post('/api/budgets/initialItem', {categoryId: 8, amount: stateChange.desiredSavings, budgetId: budgetId, mtdSpending: 0})
    const other = await axios.post('/api/budgets/initialItem', {categoryId: 7, amount: stateChange.other, budgetId: budgetId, mtdSpending: 0})
    history.push('/onboarding/step3/'+userId)
  }
}
/**
 * REDUCER
 */

 export default function (state=defaultBudget, action) {
   switch (action.type) {
     case GET_BUDGET:
      return action.budget
     default:
      return state
   }
 }


 function getCatId(catArr, catName) {
   for(let i=0; i<catArr.length; i++) {
     if (catArr[i].name === catName) {
       return catArr[i].id
     }
   }
   return false
 }
