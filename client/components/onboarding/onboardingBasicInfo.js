import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  Grid,
  Form,
  Button,
  Label,
  Card,
  Message,
  Popup,
  Segment,
  Divider
} from 'semantic-ui-react'
import {createUser} from '../../store/index'
import OnboardingSteps from './onboardingSteps'
import {convertPhoneNumber} from '../../../utils'
import axios from 'axios'

class Onboarding extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      message: false
    }
    this.handleMessage = this.handleMessage.bind(this)
    this.handleValidation = this.handleValidation.bind(this)
  }

  handleMessage = event => {
    let stateChange = {}
    stateChange[event.target.name] = event.target.value
    this.setState(stateChange)
  }

  handleValidation = (state, event) => {
    state.phoneNumber = convertPhoneNumber(this.state.phoneNumber)

    if (this.state.phoneNumber === '2313604308') {
      axios.get('/api/twilio')
    }

    const validation = validate(state)
    if (validation === 'ok') {
      this.props.handleSubmit(state, event)
    } else {
      this.setState({
        message: validation
      })
    }
  }

  render() {
    return (
      <Grid centered columns={2}>
        <br />
        <OnboardingSteps step="step1" />
        <Segment attached>
          {/* <Card > */}
          {this.state.message && (
            <div>
              <Message negative>{this.state.message}</Message>
              <br />
            </div>
          )}
          {/* <Label size="massive" fluid>
            User Information
          </Label> */}
          <h2 />
          <Form onSubmit={event => this.handleValidation(this.state, event)}>
            <Form.Field className="padding-left">
              <label>First Name</label>
              <input
                placeholder="First Name"
                name="firstName"
                onChange={this.handleMessage}
              />
            </Form.Field>
            <br />
            <Form.Field className="padding-left">
              <label>Last Name</label>
              <input
                placeholder="Last Name"
                name="lastName"
                onChange={this.handleMessage}
              />
            </Form.Field>
            <br />
            <Form.Field className="padding-left">
              <label>Email</label>
              <input
                placeholder="Email"
                name="email"
                onChange={this.handleMessage}
              />
            </Form.Field>
            <br />
            <Form.Field className="padding-left">
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.handleMessage}
              />
            </Form.Field>
            <br />
            <Form.Field className="padding-left">
              <label>
                Mobile Number (optional)
                <Popup
                  trigger={
                    <Label style={{marginLeft: '1rem'}} circular>
                      ?
                    </Label>
                  }
                  content="Entering a valid phone number will enable you to ask Ducky for certain information about your finances like bills due, budget progress, and spending habits."
                />
              </label>
              <input
                placeholder="xxx-xxx-xxxx"
                name="phoneNumber"
                onChange={this.handleMessage}
              />
            </Form.Field>
            <br />
            <Button fluid type="submit">
              Submit
            </Button>
          </Form>
          {/* </Card> */}
        </Segment>
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {
    message: state.message
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSubmit: (stateChange, event) => {
      event.preventDefault()
      dispatch(createUser(stateChange, ownProps.history))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding)

function validate(inputs) {
  if (!inputs.firstName) {
    return 'Need First Name - None Entered. Please re-submit.'
  }
  if (!inputs.lastName) {
    return 'Need Last Name - None Entered. Please re-submit.'
  }
  if (!inputs.email || inputs.email.indexOf('@') === -1) {
    return 'Email address must have an @. Please re-submit.'
  }
  if (inputs.phoneNumber && inputs.phoneNumber.length !== 10) {
    return 'Phone number is optional but must be ten digits. Please re-submit'
  }
  if (!inputs.password.length) {
    return 'Password required'
  }
  return 'ok'
}
