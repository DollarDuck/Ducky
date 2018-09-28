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
        <Menu.Menu position='right'>
          {/* The navbar will show these links after you log in */}

          <Menu.Item name='Me' as={Link} to='/home'/>
          <Menu.Item name='Home' as={Link} to='/me'/>
          <Menu.Item name='Logout' href='#' onClick={handleClick} />
        </Menu.Menu>
      ) : (
        <Menu.Menu position='right'>
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/onboarding">Sign Up</Link>
          <Link to="/signup">Sign Up</Link>
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
