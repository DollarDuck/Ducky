import axios from 'axios'

const GET_PLAN = 'GET_PLAN'
const GET_PLAN_OPTIONS = 'GET_PLAN_OPTIONS'

const getPlan = plan => ({type: GET_PLAN, plan})
const getPlans = plans => ({ type: GET_PLAN_OPTIONS, plans})

export const calculatePlan = formInfo => async dispatch => {
  const budget = await axios.get(`/api/budgets/${formInfo.userId}`)
  const totalBudget = budget.data[0].income
  console.log('formInfo', formInfo.numMonths)
  if(formInfo.numMonths) {
    const data = calculatePlanInfo(formInfo.totalCost, formInfo.numMonths, totalBudget)
    dispatch(getPlan(data))
  } else {
    const options = [calculatePlanInfo(formInfo.totalCost, 1, totalBudget), calculatePlanInfo(formInfo.totalCost, 3, totalBudget), calculatePlanInfo(formInfo.totalCost, 6, totalBudget)]
    dispatch(getPlans(options))
  }
}

export default (state = { singleOption: {costPerMonth: 0, totalBudget: 0, percentageTotalBudget: 0, totalCost: 0, numLattes: 0, numLunches: 0}, multipleOptions: []}, action) => {
  switch (action.type) {
    case GET_PLAN:
      return {...state, singleOption: action.plan}
    case GET_PLAN_OPTIONS:
      return {...state, multipleOptions: action.plans}
    default:
      return state
  }
}

function calculatePlanInfo (totalCost, numMonths, totalBudget) {
    const costPerMonth = Math.round(Number(totalCost)/Number(numMonths)*100)/100
    totalCost = Number(totalCost)
    const percentageTotalBudget = Math.round(costPerMonth/Number(totalBudget)*100)
    const numLattes = Math.round(costPerMonth/3.5)
    const numLunches = Math.round(costPerMonth/12.0)
  return {costPerMonth, totalBudget, percentageTotalBudget, totalCost, numLattes, numLunches, numMonths}
}