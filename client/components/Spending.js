import React from 'react'
import {Link, Route, Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {Menu, Container, Divider, Grid, Button } from 'semantic-ui-react'
import Transactions from './transactions'
import SpendingDoughnut from './SpendingDoughnut'

class SpendingMenu extends React.Component {
  state = {activeItem: 'transactions'}

  handleItemClick = (e, {name}) => this.setState({activeItem: name})

  render() {
    const {activeItem} = this.state

    return (
      <Container>
        <Divider hidden />
        <Menu attached='top' tabular>
          <Menu.Item
            name="transactions"
            active={activeItem === 'transactions'}
            onClick={this.handleItemClick}
            as={Link}
            to={`/spending/transactions/${this.props.user.id}`}
          />
          <Menu.Item
            name="spending"
            active={activeItem === 'spending'}
            onClick={this.handleItemClick}
            as={Link}
            to={`/spending/chart/${this.props.user.id}`}
          />
          <Menu.Item position="right">
            <img src="/duck.svg" />
          </Menu.Item>
          <hr />
        </Menu>
        <h1 />
          <Link to="/me"><Button size="large" floated='left'>Back to Home</Button></Link>

        {this.state.activeItem === 'transactions'
        ? <Transactions />
        : <SpendingDoughnut />}
      </Container>
    )
  }
}

const mapState = state => ({
	user: state.user
})

export default connect(mapState)(SpendingMenu)

