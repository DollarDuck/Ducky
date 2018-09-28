import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button, Checkbox} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {createUser} from '../../store/index'

import OnboardingSteps from './onboardingSteps'

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
    this.toggleTerms = this.toggleTerms.bind(this)
    this.handleMessage = this.handleMessage.bind(this)

  }

  toggleTerms = () => {
    const currentState = this.state.checked
    console.log('current: ', currentState)
    this.setState({
      checked: !currentState
    })
    console.log(this.state.checked)
  }



  handleMessage = event => {
    let stateChange = {};
    stateChange[event.target.name] = event.target.value;
    this.setState(stateChange)
    console.log(this.state)
  }


  render() {
    const handleSubmit = this.props.handleSubmit
    return(
      <div>
      <OnboardingSteps step='step1'/>
      <Form onSubmit={(event)=> handleSubmit(this.state, event)}>
      <Form.Field >
        <label>First Name</label>
        <input placeholder='First Name' name='firstName' onChange={this.handleMessage} />
      </Form.Field>
      <br />
      <Form.Field>
        <label>Last Name</label>
        <input placeholder='Last Name' name='lastName' onChange={this.handleMessage} />
      </Form.Field>
      <br />
      <Form.Field>
        <label>Email</label>
        <input placeholder='Email' name='email' onChange={this.handleMessage} />
      </Form.Field>
      <br />
      <Form.Field>
        <label>Password</label>
        <input type='password' placeholder='Password' name='password' onChange={this.handleMessage}/>
      </Form.Field>
      <br />
      <Form.Field>
        <label>Mobile Number</label>
        <input placeholder='xxx-xxx-xxxx' name='phoneNumber' onChange={this.handleMessage}/>
      </Form.Field>
      <br />
      <Form.Field>
        <Checkbox label='I agree to the Terms and Conditions' onClick={this.toggleTerms}/>
      </Form.Field>
      <br />
      <Button type='submit' disabled={!this.state.checked}>Submit</Button>
    </Form>
    {(!this.state.checked && this.state.phoneNumber !== '') ? <p>you must agree to the terms before you can submit.</p> : <p> </p> }
    </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSubmit: (stateChange, event) => {
      event.preventDefault();
      dispatch(createUser(stateChange, ownProps.history))
    }
  }
}

export default connect(null, mapDispatchToProps)(Onboarding)
