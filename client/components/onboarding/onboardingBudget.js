import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button, Checkbox, Label, Message, Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {Doughnut} from 'react-chartjs-2';
import {createBudget} from '../../store/budget'

import OnboardingSteps from './onboardingSteps'

class OnboardingBudget extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      // Boolean turn to true once user enter income
      incomeEnteredBoolean: false,
      income: 0,
      desiredSavings: 0,
      userId: 0
    })
    this.incomeEntered = this.incomeEntered.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }


  //function is run when user finishes entering income
  incomeEntered = (event) => {
    const userId = this.props.user.id
    this.setState({
      incomeEnteredBoolean: true,
      income: event.target.value,
      desiredSavings: Math.round(event.target.value*0.15),
      userId: userId
    })
    console.log(this.state)
  }

  //handles change to user input in income field
  handleChange = (event) => {
    const savings = event.target.value
    this.setState({
      desiredSavings: savings
    })
  }

  render() {
    console.log(this.props)
    const incomeEnteredBoolean = this.state.incomeEnteredBoolean
    console.log(this.state.incomeEntered)
    const desiredSavings = this.state.desiredSavings
    const income = this.state.income
    const rent = Math.round(0.33*(income-desiredSavings))
    const food = Math.round(0.15*(income-desiredSavings))
    const other = income - desiredSavings - rent - food
    console.log(income, rent, food, other)

    return(
      <div>
        <OnboardingSteps step='step2'/>
        <Form>
      <Form.Field>
        <label>Enter Your Post-Tax Monthly Income</label>
        <input placeholder='$' name='income' onMouseLeave={this.incomeEntered}/>
      </Form.Field>
      <br />

      {/* BEGINNING OF WHAT'S RENDERED IF INCOME ENTERED */}
      {(incomeEnteredBoolean) &&
      <div>
        <h5> Of your ${this.state.income}, we'd recommend you save at least ${Math.round(0.15*this.state.income)} per month which equates to 15% of your salary
        </h5>
        <br />
        <Label color='green'>Use the slider to adjust your desired savirgs amount</Label>
        <br />
        <br />

        {/* The Savings Slider  */}
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
        {(desiredSavings < 0.01 * income) &&
        <Message>
           <p> <Icon name='frown' size='huge'/>
         You need to same something for a rainy day! </p>
          </Message>

        }

        {(desiredSavings > 0.39 * income) &&
          <Message>
            <p> We only allow a maximum of 40%. If you are able to save more than 40% and still eat and sleep, you probably don't need this app.
              </p>
            </Message>
        }

          <h3>
          Saving ${desiredSavings} per month would equate to saving {Math.round(100*desiredSavings/this.state.income)}% of your salary. Here is what a sample savings plan looks like (you will be able to adjust it later).
          </h3>
          <Doughnut data={{labels: ['Savings ('+Math.round(100*(desiredSavings/income))+'%)', 'Rent (' + Math.round(100*rent/income) + '%)', 'Food ('+Math.round(100*(food/income))+'%)', 'Other ('+Math.round(100*other/income)+'%)'], datasets: [{data: [desiredSavings, rent, food, other], backgroundColor: ['#52E577', '#F7464A', '#C61296', '#99347E']}]}} options={{legend: {position: 'bottom'}}} height='50%' />
          <br />




          <Button type='button' onClick={(event) => {
            this.props.history.push('/onboarding/step3')
            this.props.handleOk(this.state, event)}}>Ok, got it </Button>
      </div>
      }
      {/* END OF WHAT'S RENDERED IF INCOME ENTERED */}

      <br />


    </Form>

    </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleOk: (stateChange) => {
      console.log('state change')
      console.log(stateChange)

      dispatch(createBudget(stateChange, ownProps.history))
    }
  }
}
export default connect(mapState, mapDispatchToProps)(OnboardingBudget)


