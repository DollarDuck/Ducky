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


const getBudget = userId => ({type: GET_BUDGET, userId})
const updatedBudget = budget => ({type: UPDATED_BUDGET, budget})

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
    const response = await axios.post('/api/budgets/' + userId, stateChange)
    const newBudget = response.data
    const budgetId = newBudget.id
    dispatch(getBudget(newBudget))

    // Default Budget Items
    const resCat = await axios.get('/api/budgets/allCategories')
    const categories = resCat.data

    let foodId = getCatId(categories, 'Food and Drink')
    let  housingId = getCatId(categories, 'Housing')
    let otherId = getCatId(categories, 'Other')
    let foodAmount = Math.round((Number(stateChange.income)-stateChange.desiredSavings)*0.15)
    let housingAmount = Math.round((Number(stateChange.income)-stateChange.desiredSavings)*0.33)
    let otherAmount = Number(stateChange.income)-stateChange.desiredSavings- housingAmount-foodAmount

    const food = await axios.post('/api/budgets/initialItem/'+foodId+'/'+foodAmount+'/'+budgetId+'/0')
    const housing = await axios.post('/api/budgets/initialItem/'+housingId+'/'+housingAmount+'/'+budgetId+'/0')
    const other = await axios.post('/api/budgets/initialItem/'+otherId+'/'+otherAmount+'/'+budgetId+'/0')

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


 function getCatId(catArr, catName) {
   for(let i=0; i<catArr.length; i++) {
     if (catArr[i].name === catName) {
       return catArr[i].id
     }
   }
   return false
 }
