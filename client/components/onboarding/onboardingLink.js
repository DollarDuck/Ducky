import React, {Component} from 'react'
import Plaid from '../plaidLink'
import {Segment, Grid} from 'semantic-ui-react'
import OnboardingSteps from './onboardingSteps'

export default class OnboardingLink extends Component {
  render() {
    return (
      <Grid centered>
        <OnboardingSteps step="step3" />
        <Segment attached>
          <Plaid isOnboarding={true} />
        </Segment>
      </Grid>
    )
  }
}
