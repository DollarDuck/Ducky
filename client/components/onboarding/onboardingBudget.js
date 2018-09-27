import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button, Checkbox, Label} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

import OnboardingSteps from './onboardingSteps'

class OnboardingBudget extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      incomeEnteredBoolean: false,
      income: 0,
      desiredSavings: 0,
      savingsRateComplete: false
    })
    this.incomeEntered = this.incomeEntered.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  incomeEntered = (event) => {
    this.setState({
      incomeEnteredBoolean: true,
      income: event.target.value,
      desiredSavings: Math.round(event.target.value*0.15)
    })
  }

  // savingsRateCompleted = (event) => {
  //   this.setState({

  //   })
  // }

  handleChange = (event) => {
    const savings = event.target.value
    this.setState({
      desiredSavings: savings
    })

  }



  render() {
    const incomeEnteredBoolean = this.state.incomeEnteredBoolean
    console.log(this.state.incomeEntered)
    const desiredSavings = this.state.desiredSavings
    return(
      <div>
        <OnboardingSteps step='step2'/>
        <Form>
      <Form.Field>
        <label>Enter Your Post-Tax Monthly Income</label>
        <input placeholder='$' name='income' onMouseLeave={this.incomeEntered}/>
      </Form.Field>
      <br />

      {(incomeEnteredBoolean) && <div>
        <h5> Of your ${this.state.income}, we'd recommend you save at least ${Math.round(0.15*this.state.income)} per month which equates to 15% of your salary
        </h5>
        <br />
        <Label color='green'>Use the slider to adjust your desired savings amount</Label>
        <br />
        <br />
        <Form.Input
              label={`$${desiredSavings}`}
              min={0}
              max={this.state.income/2.5}
              name='duration'
              onChange={this.handleChange}
              step={10}
              type='range'
              value={desiredSavings}
            />

        <br />
          <h3>
          Saving ${desiredSavings} per month would equate to saving {Math.round(100*desiredSavings/this.state.income)}% of your salary.
          </h3>
        </div>
          }
      <br />
      {(incomeEnteredBoolean) && <Button type='button'>Ok, I got a savings plan that works!</Button>}
    </Form>
    </div>
    )
  }
}

export default connect(null, null)(OnboardingBudget)
