import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import bills from './bills'
import transactions from './plaid'
import balances from './balances'
import budget from './budget'
import {reducer as form} from 'redux-form'

const reducer = combineReducers({user, bills, transactions, budget, balances, form})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
