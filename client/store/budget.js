import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_BUDGET = 'GET_BUDGET'
const UPDATED_BUDGET = 'UPDATED_BUDGET'

/**
 * INITIAL STATE
 */
const defaultBudget = {}

/**
 * ACTION CREATORS
 */
const updatedBudget = budget => ({type: UPDATED_BUDGET, budget})
const getBudget = budget => ({type: GET_BUDGET, budget})

export const getBudgetFromServer = userId => {
  return async dispatch => {
    const budget = await axios.get(`/api/budgets/${userId}`)
    dispatch(getBudget(budget.data))
  }
}

export const addPurchaseToBudget = (cost, userId) => {
  return async dispatch => {
    const budget = await axios.get(`/api/budgets/${userId}`)
    console.log('budget!!', budget)
    const budgetId = budget.data[0].id
    console.log('info', cost, budgetId)
    await axios.post(`/api/budgets/initialItem`, {budgetId: budgetId, categoryId: 10, amount: cost, mtdSpending: 0})
    await axios.put(`/api/budgets/budgetItem/other`, {budgetId: budgetId, categoryId: 7, amountDec: cost})
    const updateBudget = await axios.get(`/api/budgets/${userId}`)
    dispatch(getBudget(updateBudget))
  }
}

export const updateBudgetItems = updateInfo => {
  return async dispatch => {
    await axios.put('/api/budgets/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.totalBudget})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.food, categoryId: 9})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.monthlyExpenses, categoryId: 1})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.shopping, categoryId: 3})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.travel, categoryId: 4})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.recreation, categoryId: 6})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.other, categoryId: 7})
    await axios.put('/api/budgets/budgetItems/updateAmount', {budgetId: updateInfo.budgetId, amount: updateInfo.savings, categoryId: 8})
    const newBudget = await axios.get(`/api/budgets/${updateInfo.userId}`)
    dispatch(getBudget(newBudget.data))
    history.push(`/budget/${updateInfo.userId}`)
  }
}

const getCategoryId = async categoryName => {
  const {data} = await axios.get('/api/budgets/allCategories')
    const categories = data
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].name === categoryName) {
        return categories[i].id
      }
    }
    return false
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
    const food = await axios.post('/api/budgets/initialItem', {categoryId: 9, amount: stateChange.food, budgetId: budgetId})
    const monthlyDB = await axios.post('/api/budgets/initialItem', {categoryId: 1, amount: stateChange.monthlyExpenses, budgetId: budgetId})
    const shopping = await axios.post('/api/budgets/initialItem', {categoryId: 3, amount: stateChange.shopping, budgetId: budgetId})
    const travel = await axios.post('/api/budgets/initialItem', {categoryId: 4, amount: stateChange.travel, budgetId: budgetId})
    const recreation = await axios.post('/api/budgets/initialItem', {categoryId: 6, amount: stateChange.recreation, budgetId: budgetId})
    const savings = await axios.post('/api/budgets/initialItem', {categoryId: 8, amount: stateChange.desiredSavings, budgetId: budgetId})
    const other = await axios.post('/api/budgets/initialItem', {categoryId: 7, amount: stateChange.other, budgetId: budgetId})
    history.push('/onboarding/step3/'+userId)
  }
}

export const updateBudget = billAmount => async dispatch => {
  try {
    const { data } = await axios.put(`/api/budgets/budgetItems/2`, billAmount)
    dispatch(updatedBudget(data))
  } catch (err) {
    console.error(err)
  }
}
/**
 * REDUCER
 */

 export default function (state=defaultBudget, action) {
   switch (action.type) {
     case GET_BUDGET:
      return action.budget
    case UPDATED_BUDGET:
      return action.budget
     default:
      return state
   }
 }

