import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getTransactions, getBalances} from '../store/plaid'
import {updateUser} from '../store/user'

/**
 * COMPONENT
 */

class UserHome extends React.Component {
  componentDidMount() {
    if(this.props.user.lastUpdated) {
      const lastUpdateDate = this.props.user.lastUpdated
      const userId = this.props.user.id
      this.props.getTransactions(userId, lastUpdateDate)
      this.props.getBalances(userId)
      this.props.updateUser(userId)
    }
  }
  render() {
  const {user, email} = this.props

  return (
    <div>
      <h3>Welcome, {email}</h3>
    </div>
  )
}
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    user: state.user,
    email: state.user.email
  }
}

const mapDispatch = dispatch => ({
  getTransactions: (userId, lastUpdateDate) => dispatch(getTransactions(userId, lastUpdateDate)),
  updateUser: (userId) => dispatch(updateUser(userId)),
  getBalances: (userId) => dispatch(getBalances(userId))
})

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
