import axios from 'axios'

const GET_PLAN = 'GET_PLAN'

const getPlan = plan => ({type: GET_PLAN, plan})

export const calculatePlan = formInfo => async dispatch => {
  console.log('formInfo',formInfo)
  const costPerMonth = Math.round(Number(formInfo.totalCost)/Number(formInfo.numMonths)*100)/100
  console.log('costpermonth', costPerMonth)
  const totalCost = Number(formInfo.totalCost)
  const budget = await axios.get(`/api/budgets/${formInfo.userId}`)
  console.log('budget', budget)
  const totalBudget = budget.data[0].income
  const percentageTotalBudget = Math.round(costPerMonth/Number(totalBudget)*100)
  const numLattes = Math.round(costPerMonth/3.5)
  const numLunches = Math.round(costPerMonth/12.0)
  const data = {costPerMonth, totalBudget, percentageTotalBudget, totalCost, numLattes, numLunches}
  dispatch(getPlan(data))
}

export default (state = {costPerMonth: 0, totalBudget: 0, percentageTotalBudget: 0, totalCost: 0, numLattes: 0, numLunches: 0}, action) => {
  switch (action.type) {
    case GET_PLAN:
      return action.plan
    default:
      return state
  }
}
