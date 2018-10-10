import React, {Component} from 'react'
import {Icon, Menu, Sidebar} from 'semantic-ui-react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import Routes from '../routes'

class SidebarMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {visible: false}
  }

  handleSidebarHide = () => this.setState({visible: false})

  render() {
    const {visible} = this.props
    const {user} = this.props

    return (
      <Sidebar.Pushable attached="bottom">
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={visible}
          width="thin"
        >
          <Menu.Item as={Link} to={`/budget/${user.id}`}>
            <Icon name="edit" />
            Budgeting
          </Menu.Item>
          <Menu.Item as={Link} to={`/spending/${user.id}`}>
            <Icon name="money bill alternate outline" />
            Spending
          </Menu.Item>
          <Menu.Item as={Link} to={`/bills/${user.id}`}>
            <Icon name="calendar alternate outline" />
            Bills
          </Menu.Item>
          <Menu.Item as={Link} to="/balances">
            <Icon name="balance" />
            Account Balances
          </Menu.Item>
          <Menu.Item as={Link} to={`/purchasePlanner/${user.id}`}>
            <Icon name="dollar" />
            Purchase Planner
          </Menu.Item>
          <Menu.Item as={Link} to="/lifeevents/gradschool/input">
            <Icon name="university" />
            Grad School Calculator
          </Menu.Item>
        </Sidebar>
        <Routes />
      </Sidebar.Pushable>
    )
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}

export default withRouter(connect(mapState)(SidebarMenu))
