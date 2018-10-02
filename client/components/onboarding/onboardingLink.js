import React, {Component} from 'react'
import Plaid from '../plaidLink'
// import {createBudget} from '../../store/index'

import OnboardingSteps from './onboardingSteps'

export default class OnboardingLink extends Component {
  render() {
    return(
      <div>
        <OnboardingSteps step='step3'/>
        <Plaid isOnboarding={true}/>
    </div>
    )
  }
}



