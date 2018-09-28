import React from 'react'
import { Container, Card, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Dashboard extends React.Component {

  render() {
    const {user} = this.props
    return (
      <Container>
        <Card.Group>
          <Card as={Link} to="/me">
            <Card.Content>
              <Image src='/duck.svg' />
            </Card.Content>
          </Card>
          <Card as={Link} to={`/spending/${user.id}`}>
            <Card.Content>
              <Image src='/chart.png' />
            </Card.Content>
          </Card>
          <Card as={Link} to={`/bills/${user.id}`}>
            <Card.Content>
              <Card.Header>Bills Due</Card.Header>
              <Image src='/calendar.jpg' />
            </Card.Content>
          </Card>
          <Card as={Link} to={`/transactions/${user.id}`}>
            <Card.Content>
              <Card.Header>Account Balances</Card.Header>
              <Image src='/table.jpg' />
            </Card.Content>
          </Card>
          <Card as={Link} to={`/purchaseplanner/${user.id}`}>
            <Card.Content>
              <Card.Header>Purchase Planner</Card.Header>
              <Image src='/beach.jpg' />
            </Card.Content>
          </Card>
          <Card as={Link} to={`/lifeevents/${user.id}`}>
            <Card.Content>
              <Card.Header>Life Events</Card.Header>
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
    email: state.user.email
  }
}

export default connect(mapState)(Dashboard)
