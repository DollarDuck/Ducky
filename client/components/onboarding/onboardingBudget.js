import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button, Checkbox} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

import OnboardingSteps from './onboardingSteps'

class OnboardingBudget extends Component {

  render() {
    return(
      <div>
        <OnboardingSteps step='step2'/>
        <Form>
      <Form.Field>
        <label>Enter Your Monthly Income</label>
        <input placeholder='$' />
      </Form.Field>
      <br />
      <Form.Field>
        <label>Last Name</label>
        <input placeholder='Last Name' />
      </Form.Field>
      <br />
      <Form.Field>
        <label>Email</label>
        <input placeholder='Email' />
      </Form.Field>
      <br />
      <Form.Field>
        <label>Password</label>
        <input placeholder='Password' />
      </Form.Field>
      <br />
      <Form.Field>
        <Checkbox label='I agree to the Terms and Conditions' />
      </Form.Field>
      <br />
      <Button type='submit'>Submit</Button>
    </Form>
    </div>
    )
  }
}

export default connect(null, null)(OnboardingBudget)
