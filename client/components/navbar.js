import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Menu, Header} from 'semantic-ui-react'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <Menu borderless>
    <Menu.Item>
      <img src='/duck.svg' />
    </Menu.Item>
    <Menu.Item><Header as='h2'>Ducky</Header></Menu.Item>
    <nav>
      {isLoggedIn ? (
        <Menu.Menu right fluid position='right'>
          {/* The navbar will show these links after you log in */}
          <div className="min-width" >
          <Menu.Item name='Home' position="right" as={Link} to='/me'/>
          </div>
          <div className="max-width" />
          <div className="min-width">
          <Menu.Item name='Profile' position="right" to="/userProfile" as={Link}>Profile</Menu.Item>
          </div>
          <div className="min-width">
          <Menu.Item name='Logout' href='#' position="right" onClick={handleClick} />
          </div>
        </Menu.Menu>
      ) : (
        <Menu.Menu position='right'>
          {/* The navbar will show these links before you log in */}
          <Menu.Item name='Login' as={Link} to='/login'/>
          <Menu.Item name='Sign Up' as={Link} to='/onboarding'/>
        </Menu.Menu>
      )}
    </nav>
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
