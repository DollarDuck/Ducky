import React from 'react'
import { connect } from 'react-redux'
import { getBills } from '../store/bills'
import { Button, Container, Table, Icon, Grid } from 'semantic-ui-react'
import Calendar from './Calendar'

class Bills extends React.Component {

  componentDidMount() {
    this.props.getBills(Number(this.props.match.params.userId))
  }

  render() {
    const {bills} = this.props
    const dueDates = {}
    bills.forEach(bill => {
      dueDates[bill.dueDate.slice(-2)] = [bill.name, bill.paid]
    })
    return (
      <Container>
        <Button circular floated='right' icon='plus' />
        <Grid centered>
        <Calendar bills={dueDates}/>


        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Paid?</Table.HeaderCell>
              <Table.HeaderCell>Company</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Due</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {bills.map(bill => (
              <Table.Row key={bill.id}>
                <Table.Cell>
                  {bill.paid
                  ? <Icon name='checkmark' />
                  : <Icon name='x' />}
                </Table.Cell>
                <Table.Cell>{bill.name}</Table.Cell>
                <Table.Cell>{bill.type}</Table.Cell>
                <Table.Cell>{bill.dueDate}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        </Grid>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  bills: state.bills
})

const mapDispatchToProps = dispatch => ({
    getBills: userId => dispatch(getBills(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Bills)
