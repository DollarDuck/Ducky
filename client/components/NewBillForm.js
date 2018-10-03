import React from 'react'
import {connect} from 'react-redux'
import {addBill} from '../store/bills'
import {Form, Container, Header, Grid, Button, Divider} from 'semantic-ui-react'
import {DateInput} from 'semantic-ui-calendar-react'

const options = [
  {key: 'n', text: 'Never', value: ''},
  {key: 'm', text: 'Monthly', value: 'monthly'},
  {key: 'q', text: 'Quarterly', value: 'quarterly'},
  {key: 'y', text: 'Yearly', value: 'yearly'}
]

class NewBillForm extends React.Component {
  state = {}

  handleChange = (evt, {name, value}) => {
    this.setState({[name]: value})
    console.log(this.state)
  }

  handleSubmit = () => {
    event.preventDefault()
    const date = this.state.date
    const dueDate = date.slice(6) + date.slice(3, 5) + date.slice(0, 2)
    this.props.addBill({...this.state, dueDate, userId: this.props.user.id})
    this.setState({ type: '', name: '' })
    this.props.history.push(`/bills/${this.props.user.id}`)
  }

  render() {
    return (
      <Container>
        <Divider hidden />
        <Header>Add a New Bill</Header>
        <Divider />
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
            <Form.Select compact inline fluid required
              label="Recurring"
              options={options}
              placeholder="Frequency"
              name="recurring"
              onChange={this.handleChange}
            />
          </Form.Group>
            <Button type="submit" disabled={Object.keys(this.state).length < 4}>Submit</Button>
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
  addBill: bill => dispatch(addBill(bill))
})

export default connect(mapStateToProps, mapDispatchToProps)(NewBillForm)
