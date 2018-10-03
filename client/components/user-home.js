import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


/**
 * COMPONENT
 */

class UserHome extends React.Component {

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


export default (UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
