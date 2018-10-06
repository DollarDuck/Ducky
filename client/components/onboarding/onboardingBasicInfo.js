import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button, Checkbox, Card, Label} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {createUser} from '../../store/index'
import {auth} from '../../store'
import OnboardingSteps from './onboardingSteps'
import {convertPhoneNumber} from '../../../utils'

class Onboarding extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      checked: false
    })
    this.handleMessage = this.handleMessage.bind(this)

  }

  handleMessage = event => {
    let stateChange = {};
    stateChange[event.target.name] = event.target.value;
    this.setState(stateChange)
  }


  render() {
    const handleSubmit = this.props.handleSubmit
    return(
      <div>
      <OnboardingSteps step='step1'/>
      <Card centered>
      <Label size="massive">User Information</Label>
      <h2 />
      <Form onSubmit={(event)=> handleSubmit(this.state, event)}>
      <Form.Field className="padding-left">
        <label>First Name</label>
        <input placeholder='First Name' name='firstName' onChange={this.handleMessage} />
      </Form.Field>
      <br />
      <Form.Field className="padding-left">
        <label>Last Name</label>
        <input placeholder='Last Name' name='lastName' onChange={this.handleMessage} />
      </Form.Field>
      <br />
      <Form.Field className="padding-left">
        <label>Email</label>
        <input placeholder='Email' name='email' onChange={this.handleMessage} />
      </Form.Field>
      <br />
      <Form.Field className="padding-left">
        <label>Password</label>
        <input type='password' placeholder='Password' name='password' onChange={this.handleMessage}/>
      </Form.Field>
      <br />
      <Form.Field className="padding-left">
        <label>Mobile Number</label>
        <input placeholder='xxx-xxx-xxxx' name='phoneNumber' onChange={this.handleMessage}/>
      </Form.Field>
      <br />
      <Button fluid type='submit'>Submit</Button>
    </Form>
    </Card>
    </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSubmit: (stateChange, event) => {
      event.preventDefault();
      stateChange.phoneNumber = convertPhoneNumber(stateChange.phoneNumber)
      dispatch(createUser(stateChange, ownProps.history))
    }
  }
}

export default connect(null, mapDispatchToProps)(Onboarding)
