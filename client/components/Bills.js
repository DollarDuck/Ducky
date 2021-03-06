import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getBills, editBill, deleteBill, checkMonthly } from '../store/bills'
import { Radio, Button, Container, Table, Icon, Grid, Divider, Header, Image } from 'semantic-ui-react'
import Calendar from './Calendar'

class Bills extends React.Component {
  state = {
    isLoaded: false
  }
  async componentDidMount() {
    await this.props.getBills(Number(this.props.match.params.userId))
    await this.props.checkMonthly(this.props.bills, Number(this.props.match.params.userId))
    this.setState({ isLoaded: true})
  }

  toggleBill(bill) {
    bill.paid = !bill.paid
    this.props.editBill(bill)
  }

  render() {
    const {bills, user} = this.props
    const dueDates = {}
    const currentDay = new Date()
    const currentMonth = currentDay.getMonth()+1
    bills.forEach(bill => {
      if(bill.dueDate.slice(5,7) == currentMonth) dueDates[bill.dueDate.slice(-2)] = [bill.name, bill.paid]
    })

    return (
      <Container>
        <Divider hidden />
        <Header size='huge' textAlign='center' >Bills
        <Image src='/duck.svg' size='medium' className='padded'/>
        </Header>
        <Divider />
        <Divider hidden/>
        <Button as={Link} to={`/bills/addbill/${user.id}`} floated='right' ><Icon name="plus" />Add New Bill</Button>
        <Grid centered>
        <Calendar bills={dueDates}/>

        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Paid?</Table.HeaderCell>
              <Table.HeaderCell>Company</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Due</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Delete Bill?</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {bills.map((bill) => {
              if(bill.dueDate.slice(5,7) == currentMonth) {
              return (
              <Table.Row key={bill.id}>
                <Table.Cell>
                  <Radio toggle defaultChecked={bill.paid} onClick={() => this.toggleBill(bill)} />  {bill.paid ? 'Yes' : 'No'}
                </Table.Cell>
                <Table.Cell>{bill.name}</Table.Cell>
                <Table.Cell>{bill.type}</Table.Cell>
                <Table.Cell>{bill.dueDate}</Table.Cell>
                <Table.Cell>{bill.amount}</Table.Cell>
                <Table.Cell onClick={() => this.props.deleteBill(bill.id)}><Icon name='calendar times outline' /></Table.Cell>
              </Table.Row>
            )
            }
          }
            )}
          </Table.Body>
        </Table>
        <Divider hidden />
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
    getBills: userId => dispatch(getBills(userId)),
    editBill: bill => dispatch(editBill(bill)),
    deleteBill: billId => dispatch(deleteBill(billId)),
    checkMonthly: (billArray, userId) => dispatch(checkMonthly(billArray, userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Bills)
