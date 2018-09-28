import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getTransactions} from '../store/plaid'

/**
 * COMPONENT
 */

class UserHome extends React.Component {
  componentWillMount() {
    console.log('here!!', this.props.user)
    if(this.props.user.lastUpdated) {
      const lastUpdateDate = this.props.user.lastUpdated
      const userId = this.props.user.id
      console.log('here', lastUpdateDate, userId)
      this.props.getTransactions(userId, lastUpdateDate)
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
  getTransactions: (userId, lastUpdateDate) => dispatch(getTransactions(userId, lastUpdateDate))
})

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
