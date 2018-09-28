// import axios from 'axios'
// import history from '../history'

// /**
//  * ACTION TYPES
//  */
// const GET_BUDGET = 'GET_USER'

// /**
//  * INITIAL STATE
//  */
// const defaultBudget = {}

// /**
//  * ACTION CREATORS
//  */


// const getBudget = userId => ({type: GET_BUDGET, userId})



// /**
//  * THUNK CREATORS
//  */
// export const createBudget = (stateChange, userId) => {
//   return async (dispatch) => {
//     const response = await axios.post('api/budgets/' + userId, stateChange)
//     const newBudget = response.data
//     dispatch(getBudget(newBudget))
//     history.push('/onboarding/step3/'+userId)
//   }
// }


// /**
//  * REDUCER
//  */

//  export default function (state=defaultBudget, action) {
//    switch (action.type) {
//      case GET_BUDGET:
//       return action.budget
//      default:
//       return state
//    }
//  }
