import React, { Component } from 'react'
import { Button, Header, Icon, Menu, Segment, Sidebar } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Routes from '../routes'

class SidebarMenu extends Component {
  state = { visible: false }

  handleButtonClick = () => this.setState({ visible: !this.state.visible })

  handleSidebarHide = () => this.setState({ visible: false })

  render() {
    const { visible } = this.state
    const {user} = this.props

    return (
      <div>
        <Button onClick={this.handleButtonClick}>Toggle visibility</Button>

        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={visible}
            width='thin'
          >
            <Menu.Item as={Link} to={`/budget/${user.id}`}>
              <Icon name='edit' />
              Budgeting
            </Menu.Item>
            <Menu.Item as={Link} to={`/spending/${user.id}`}>
              <Icon name='money bill alternate outline' />
              Spending
            </Menu.Item>
            <Menu.Item as={Link} to={`/bills/${user.id}`}>
              <Icon name='calendar' />
              Bills
            </Menu.Item>
            <Menu.Item as={Link} to='/balances'>
              <Icon name='balance' />
              Account Balances
            </Menu.Item>
            <Menu.Item as={Link} to={`/purchasePlanner/${user.id}`}>
              <Icon name='dollar' />
              Purchase Planner
            </Menu.Item>
            <Menu.Item as={Link} to='/lifeevents/gradschool/input'>
              <Icon name='university' />
              Grad School Calculator
            </Menu.Item>
          </Sidebar>


            <Routes />

        </Sidebar.Pushable>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}

// const mapDispatch = dispatch => ({
//   getTransactions: (userId, lastUpdateDate) => dispatch(getTransactions(userId, lastUpdateDate)),
//   updateUser: (userId) => dispatch(updateUser(userId)),
//   getBalances: (userId) => dispatch(getBalances(userId))
// })
export default withRouter(connect(mapState)(SidebarMenu))
// export default connect(mapState)(SidebarMenu)
