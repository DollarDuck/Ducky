import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Menu} from 'semantic-ui-react'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <Menu borderless>
    <Menu.Item>
      <img src='/duck.svg' />
    </Menu.Item>
    <Menu.Item><h2 className="no-padding">Dollar Ducky</h2><h5 className="no-padding">get your financial ducks in a row</h5></Menu.Item>
      {isLoggedIn ? (
        <Menu.Menu position='right' id="navBar">
          {/* The navbar will show these links after you log in */}
          <Menu.Item name='Home' as={Link} to='/me'/>
          <Menu.Item name='Profile' to="/userProfile" as={Link}>Profile</Menu.Item>
          <Menu.Item name='Logout' href='#' onClick={handleClick} />
        </Menu.Menu>
      ) : (
        <Menu.Menu position='right'>
          {/* The navbar will show these links before you log in */}
          <Menu.Item name='Login' as={Link} to='/login'/>
          <Menu.Item name='Sign Up' as={Link} to='/onboarding'/>
        </Menu.Menu>
      )}
    <hr />
  </Menu>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
