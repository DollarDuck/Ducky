import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button, Checkbox, Label, Grid, Icon, Message} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {Doughnut} from 'react-chartjs-2';
import {convertIncome} from '../../../utils'
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
      userId: 0,
      monthlyExpenses: 0,
      food: 0,
      shopping: 0,
      travel: 0,
      recreation: 0,
      other: 0
    })
    this.incomeEntered = this.incomeEntered.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }


  //function is run when user finishes entering income
  incomeEntered = (event) => {
    const userId = this.props.user.id
    const income = convertIncome(event.target.value)
    const savings = Math.round(income*0.15)
    const monthlyExpenses = Math.round(0.4*(income-savings))
    const food = Math.round(0.05*(income-savings))
    const shopping = Math.round(0.1*(income-savings))
    const travel = Math.round(0.1*(income-savings))
    const recreation = Math.round(0.1*(income-savings))
    const other = income - savings - shopping - travel - monthlyExpenses - recreation - food
    this.setState({
      incomeEnteredBoolean: true,
      income: income,
      desiredSavings: savings,
      userId: userId,
      monthlyExpenses: monthlyExpenses,
      food: food,
      shopping: shopping,
      travel: travel,
      recreation: recreation,
      other: other
    })
  }

  //handles change to user input in income field
  handleChange = (event) => {
    const income = this.state.income
    const savings = event.target.value
    const monthlyExpenses = Math.round(0.4*(income-savings))
    const food = Math.round(0.05*(income-savings))
    const shopping = Math.round(0.1*(income-savings))
    const travel = Math.round(0.1*(income-savings))
    const recreation = Math.round(0.1*(income-savings))
    const other = income - savings - shopping - travel - monthlyExpenses - recreation - food
    this.setState({
      desiredSavings: savings,
      monthlyExpenses: monthlyExpenses,
      food: food,
      shopping: shopping,
      travel: travel,
      recreation: recreation,
      other: other
    })
    console.log('state', this.state)
  }
  render() {
    const state = this.state
    const incomeEnteredBoolean = this.state.incomeEnteredBoolean
    const desiredSavings = this.state.desiredSavings
    const income = this.state.income
    return(
      <div>
        <Grid centered width={15} columns={1}>
        <Grid.Column>
        <OnboardingSteps step='step2'/>
        </Grid.Column>
        <br />
        <Form>
        <Grid.Column width={5}>
      <Form.Field>
        <label>Enter Your Post-Tax Monthly Income</label>
        <input placeholder='$' name='income' onMouseLeave={this.incomeEntered}/>
      </Form.Field>
      </Grid.Column>
      <br />

      {/* BEGINNING OF WHAT'S RENDERED IF INCOME ENTERED */}
      {(incomeEnteredBoolean) &&
      <div>
        <h5> Of your ${this.state.income}, we'd recommend you save at least ${Math.round(0.15*this.state.income)} per month which equates to 15% of your salary
        </h5>
        <br />
        <Label fluid color='green'>Use the slider to adjust your desired savings amount</Label>
        <br />
        <br />

        {/* The Savings Slider  */}
        <Form.Input
              label={`$${desiredSavings}`}
              min={0}
              max={this.state.income*0.6}
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
         You need to save something for a rainy day! </p>
          </Message>

        }

        {(desiredSavings > 0.59 * income) &&
          <Message>
            <p> We only allow a maximum of 60%. If you are able to save more than 60% and still eat and sleep, you probably don't need this app.
              </p>
            </Message>
        }

          <h3>
          Saving ${desiredSavings} per month would equate to saving {Math.round(100*desiredSavings/this.state.income)}% of your salary. Here is what a sample savings plan looks like (you will be able to adjust it later).
          </h3>
          <Doughnut data={{labels: ['Savings ('+Math.round(100*(state.desiredSavings/income))+'%)', 'Monthly Expenses (' + Math.round(100*state.monthlyExpenses/income) + '%)', 'Food ('+Math.round(100*(state.food/income))+'%)', 'Shopping (' + Math.round(100*state.shopping/income) + '%)', 'Recreation (' + Math.round(100*state.recreation/income) + '%)', 'Travel (' + Math.round(100*state.travel/income) + '%)', 'Other ('+Math.round(100*state.other/income)+'%)'], datasets: [{data: [state.desiredSavings, state.monthlyExpenses, state.food, state.shopping, state.recreation, state.travel, state.other], backgroundColor: ['#52E577', '#F7464A', '#C61296', '#99347E', '#4d94ff', '#000000', '#ffcc80']}]}} options={options} height='60%' />
          <br />
          <Button fluid color="green" type='button' onClick={(event) => {
            this.props.history.push('/onboarding/step3')
            this.props.handleOk(this.state, event)}}>Ok, got it </Button>
      </div>
      }
      {/* END OF WHAT'S RENDERED IF INCOME ENTERED */}

      <br />
    </Form>
    </Grid>
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
      dispatch(createBudget(stateChange, ownProps.history))
    }
  }
}
export default connect(mapState, mapDispatchToProps)(OnboardingBudget)


const options = {
  legend: {
    position: 'right',
    labels: {
      fontSize: 15,
      fontColor: 'black'
    }
  },

}
