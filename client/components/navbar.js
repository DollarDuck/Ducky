import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {Menu} from 'semantic-ui-react'
import {logout} from '../store'
import SidebarMenu from './SidebarMenu'

class Navbar extends React.Component {
  state = { visible: false }

  handleButtonClick = () => {
    this.setState({ visible: !this.state.visible })
  console.log('visible', this.state.visible)
  }

  render() {
    return (
  <div>
  <Menu borderless attached='top'>
    <Menu.Item>
      <img src='/duck.svg' />
    </Menu.Item>
    <Menu.Item onClick={this.handleButtonClick}><h2 className="no-padding">Dollar Ducky</h2><h5 className="no-padding">get your financial ducks in a row</h5></Menu.Item>
      {this.props.isLoggedIn ? (
        <Menu.Menu position='right' id="navBar">
          {/* The navbar will show these links after you log in */}
          <Menu.Item name='Menu' onClick={this.handleButtonClick}/>
          <Menu.Item name='Profile' to="/userProfile" as={Link}>Profile</Menu.Item>
          <Menu.Item name='Logout' href='#' onClick={this.props.handleClick} />
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
  <SidebarMenu visible={this.state.visible}/>
  </div>
    )
  }
}

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

export default withRouter(connect(mapState, mapDispatch)(Navbar))

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
