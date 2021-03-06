import React, {Component} from 'react'
import {Step, Icon, Divider} from 'semantic-ui-react'

class OnboardingSteps extends Component {
  render() {
    const step = this.props.step
    return (
      <Step.Group attached="top">
      <Divider hidden />
        <Step active={step === 'step1'}>
          <Icon name="user" />
          <Step.Content>
            <Step.Title>Basic Info</Step.Title>
            <Step.Description>
              Let's start with a name, email, and password
            </Step.Description>
          </Step.Content>
        </Step>

        <Step active={step === 'step2'}>
          <Icon name="info circle" />
          <Step.Content>
            <Step.Title>Let's figure out your monthly budget</Step.Title>
            <Step.Description>
              How much do you earn and want to save?
            </Step.Description>
          </Step.Content>
        </Step>

        <Step active={step === 'step3'}>
          <Icon name="credit card" />
          <Step.Content>
            <Step.Title>Link to Other Accounts</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
    )
  }
}

export default OnboardingSteps
