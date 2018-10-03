import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const UPDATED_USER = 'UPDATED_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const updatedUser = user => ({type: UPDATED_USER, user})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    history.push('/me')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

export const createUser = (stateChange) => {
  return async (dispatch) => {
    const response = await axios.post('api/users', stateChange)
    const newUser = response.data
    const userId = newUser.id
    dispatch(getUser(newUser))

    //after user submits basic info, it then goes to step2 with userId in url so we know where to post budget
    history.push('/onboarding/step2/' + userId)
  }
}

export const updateUser = userId => async dispatch => {
  try {
    const res = await axios.put(`/api/users/${userId}`)
    dispatch(updatedUser(res.data[1][0]))
  } catch(err) {
    console.error(err)
  }
}

export const updateUserInfo = userInfo => async dispatch => {
  try {
    console.log('userInfo', userInfo)
    const res = await axios.put(`/api/users/userInfo/${userInfo.id}`, userInfo)
    dispatch(updatedUser(res.data[1][0]))
  } catch(err) {
    console.log(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    case UPDATED_USER:
      return action.user
    default:
      return state
  }
}
