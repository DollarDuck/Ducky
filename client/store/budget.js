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


const getBudget = userId => ({type: GET_BUDGET, userId})



/**
 * THUNK CREATORS
 */
export const createBudget = (stateChange) => {
  return async (dispatch) => {
    const userId = stateChange.userId
    const response = await axios.post('/api/budgets/' + userId, stateChange)
    const newBudget = response.data
    dispatch(getBudget(newBudget))

    // Default Budget Items
    let x = {catName: 'Food and Drink'}
    const catIdFood = await axios.get('/api/budgets/CatIdByName', x)
    console.log('here')
    console.log('catIdFood: ', catIdFood.data)




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
