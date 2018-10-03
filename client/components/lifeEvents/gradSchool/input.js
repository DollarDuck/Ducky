import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button, Checkbox, Card, Label} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {convertIncome} from '../../../../utils'
import { isThisISOYear } from 'date-fns';
import Chart1 from './chart1'


class InputGradSchool extends Component {
  constructor(props) {
    super(props)
    this.state = ({

        currentSalary: 0,
        csGrowth: 3,
        expectedSalary: 0,
        esGrowth: 3,
        yearsOfSchool: 3,
        retirementAge: 65,
        age: 25,
        tuition: 0,
        livingExpenses: 0,
        discountRate: 5,

        showInput: true,
        showChart: false
    })
    this.handleMessage = this.handleMessage.bind(this)
    this.handleRange = this.handleRange.bind(this)
    this.showChart = this.showChart.bind(this)

  }

  handleMessage = (event) => {
    let stateChange = {};
    stateChange[event.target.name] = event.target.value
    this.setState(stateChange)
  }

  handleRange = event => {
    const percent = event.target.value
    let stateChange = {}
    // stateChange[event.target.name] = percent
    // this.setState(stateChange)
    // console.log(this.state)
  }

  showChart = event => {
    this.setState({
      showChart: true
    })
  }


  render() {
    console.log('hello world')
    console.log(this.state)
    const csGrowth = this.state.csGrowth
    return (
      <div>
      <h1>Should you go to Grad School? Ducky will tell you ..he he</h1>
      <Form onSubmit={()=> this.showChart()}>
      <Form.Field className="padding-left">
        <label>My Age</label>
        <input placeholder='Enter Age' name='age' defaultValue={25} type='number' onChange={this.handleMessage} />
      </Form.Field>
      <br />
      <Form.Field className="padding-left">
        <label>Current Salary</label>
        <input placeholder='Enter Current Salary' name='currentSalary' onChange={this.handleMessage} />
      </Form.Field>
      <Form.Input
              label={`And I expect my current salary to grow ${csGrowth}% per year`}
              min={-2}
              max={12}
              name='csGrowth'
              onChange={this.handleRange}
              step={1}
              type='range'
              value={csGrowth}
            />
        <br />
        <Form.Field className="padding-left">
        <label>Salary After</label>
        <input placeholder='Enter Expected Salary' name='expectedSalary' onChange={this.handleMessage} />
      </Form.Field>
      <Form.Input
              label={`And I expect my salary post grad-School to grow ${csGrowth}% per year`}
              min={-2}
              max={12}
              name='esGrowth'
              onChange={this.handleRange}
              step={1}
              type='range'
              value={csGrowth}
            />
        <br />

      <Form.Field className="padding-left">
        <label>Grad School Takes How Many Years?</label>
        <input type='number' placeholder={3} name='yearsOfSchool' onChange={this.handleMessage}/>
      </Form.Field>
      <Form.Field className="padding-left">
        <label>Tuition is...</label>
        <input name='tuition' onChange={this.handleMessage}/>
      </Form.Field>
      <Form.Field className="padding-left">
        <label>and my living Expenses are</label>
        <input name='livingExpenes' onChange={this.handleMessage}/>
      </Form.Field>
      <Form.Field className="padding-left">
        <label>And I expect to Retire</label>
        <input placeholder='65' name='retirementAge' onChange={this.handleMessage}/>
      </Form.Field>
      <h2> need to create discount rate, currently defaulted to 5% </h2>
      <br />
      <Button fluid color="blue" type='submit'>Submit</Button>
    </Form>
   <br/>
      <h2>f</h2>
    {this.state.showChart && <Chart1 data={this.state} /> }
    </div>

    )
  }






}


export default connect(null, null)(InputGradSchool)
