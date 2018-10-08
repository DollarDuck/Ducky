import React from 'react'
import {connect} from 'react-redux'
import {addBill} from '../store/bills'
import {updateBudget} from '../store/budget'
import {Popup, Label, Form, Container, Header, Grid, Button, Divider} from 'semantic-ui-react'
import {DateInput} from 'semantic-ui-calendar-react'

const options = [
  {key: 'n', text: 'Never', value: ''},
  {key: 'm', text: 'Monthly', value: 'monthly'},
  {key: 'q', text: 'Quarterly', value: 'quarterly'},
  {key: 'y', text: 'Yearly', value: 'yearly'}
]

class NewBillForm extends React.Component {
  state = { checked: false }

  handleChange = (evt, {name, value}) => {
    this.setState({[name]: value})
    console.log(this.state)
  }

  toggle = () => this.setState({ checked: !this.state.checked })

  handleSubmit = async () => {
    event.preventDefault()
    const date = this.state.date
    const dueDate = date.slice(6) + date.slice(3, 5) + date.slice(0, 2)
    await this.props.addBill({...this.state, dueDate, userId: this.props.user.id})
    await this.props.updateBudget({
      billAmount: this.state.amount,
      userId: this.props.user.id,
      addBill: this.state.checked
    })
    this.setState({ type: '', name: '' })
    this.props.history.push(`/bills/${this.props.user.id}`)
  }

  render() {
    return (
      <Container>
        <Divider hidden />
        <Header>Add a New Bill</Header>
        <Divider />
        <Divider hidden />
        <Grid centered>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group inline >
            <Form.Input required
              label="Company"
              placeholder="Company"
              name="name"
              onChange={this.handleChange}
            />
            <Form.Input required
              label="Type"
              placeholder="e.g. Water, Electric..."
              name="type"
              onChange={this.handleChange}
            />
            <Form.Input required
              label="Amount"
              placeholder="Estimated amount"
              name="amount"
              onChange={this.handleChange}
            />
            <Form.Select inline required
              label="Recurring"
              options={options}
              placeholder="Frequency"
              name="recurring"
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Checkbox label='Add this bill to my budget' onChange={this.toggle} checked={this.state.checked}/>
              <Popup trigger={<Label style={{marginLeft: '1rem'}} circular>?</Label>} content='If you feel like this bill is already covered in your monthly expenses, do not check this box. If you would like to increase your budget by the cost of this bill, check this box.'/>
          </Form.Group>
          <Header as="h5">Due date*</Header>
          <Form.Field required>
            <DateInput
              inline
              name="date"
              placeholder="Date"
              value={this.state.date}
              iconPosition="left"
              onChange={this.handleChange}
            />
          </Form.Field>
          <br />
          <Button type="submit" disabled={Object.keys(this.state).length < 6}>Submit</Button>
        </Form>
        </Grid>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  addBill: bill => dispatch(addBill(bill)),
  updateBudget: amount => dispatch(updateBudget(amount))
})

export default connect(mapStateToProps, mapDispatchToProps)(NewBillForm)
