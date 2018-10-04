import React from 'react'
import { Container, Card, Image, Grid, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {getTransactions, getBalances} from '../store/plaid'
import {updateUser} from '../store/user'

class Dashboard extends React.Component {
  componentDidMount() {
    console.log('user', this.props.user)
    if(this.props.user.lastUpdated) {
      const lastUpdateDate = this.props.user.lastUpdated
      const userId = this.props.user.id
      this.props.getTransactions(userId, lastUpdateDate)
      this.props.getBalances(userId)
      this.props.updateUser(userId)
    }
  }
  render() {
    const {user, bills} = this.props
    const dueDates = {}
    bills.forEach(bill => {
      dueDates[bill.dueDate.slice(-2)] = [bill.name, bill.paid]
    })
    return (
      <Container>
        <Divider hidden/>
        <h1 />
        <Card.Group>
          <Card as={Link} to="/me">
            <Card.Content>
              <Card.Header >Budgeting</Card.Header>
              <Divider />
              <Image src='/coins.jpeg' />
            </Card.Content>
          </Card>
          <Card as={Link} to={`/spending/${user.id}`}>
            <Card.Content>
              <Card.Header>Spending</Card.Header>
              <Divider />
              <Image src='/money.jpeg' />
            </Card.Content>
          </Card>
          <Card as={Link} to={`/bills/${user.id}`}>
            <Card.Content>
              <Card.Header>Bills Due</Card.Header>
              <Divider />
              <Image src='/calendar.jpeg' />
            </Card.Content>
          </Card>
          <Card as={Link} to={'/balances'}>
            <Card.Content>
              <Card.Header>Account Balances</Card.Header>
              <Divider />
              <Image src='/account-balances.jpg' />
            </Card.Content>
          </Card>
          <Card as={Link} to={`/purchaseplanner/${user.id}`}>
            <Card.Content>
              <Card.Header>Purchase Planner</Card.Header>
              <Divider />
              <Image src='/purchase planner.jpg' />
            </Card.Content>
          </Card>
          <Card as={Link} to={`/lifeevents/${user.id}`}>
            <Card.Content>
              <Card.Header>Life Events</Card.Header>
              <Divider />
              <Image src='/lifeevents.jpg' />
            </Card.Content>
          </Card>
        </Card.Group>
      </Container>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    email: state.user.email,
    bills: state.bills
  }
}

const mapDispatch = dispatch => ({
  getTransactions: (userId, lastUpdateDate) => dispatch(getTransactions(userId, lastUpdateDate)),
  updateUser: (userId) => dispatch(updateUser(userId)),
  getBalances: (userId) => dispatch(getBalances(userId))
})

export default connect(mapState, mapDispatch)(Dashboard)
