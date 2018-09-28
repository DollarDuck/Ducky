import React from 'react'
import { Container, Card, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Dashboard extends React.Component {

  render() {
    return (
      <Container>
        <Card.Group>
          <Card as={Link} to="/me">
            <Image src='/duck.svg' />
          </Card>
          <Card as={Link} to="/me">
            <Image src='/chart.png' />
          </Card>
          <Card as={Link} to="/me">
            <Card.Header>Bills Due</Card.Header>
            <Image src='/calendar.jpg' />
          </Card>
          <Card as={Link} to="/me">

          </Card>
          <Card as={Link} to="/me">
            <Card.Header>Purchase Planner</Card.Header>
          </Card>
          <Card as={Link} to="/me">
            <Card.Header>Life Events</Card.Header>
          </Card>
        </Card.Group>
      </Container>
    )
  }

}

export default Dashboard
