import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button, Checkbox, Card, Label, Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import Chart1 from './chart1'
import Chart2 from './chart2'

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
        discountRate: 6,
        display: 'input',
        dataObj: {}
    })
    this.handleMessage = this.handleMessage.bind(this)
    this.showChart = this.showChart.bind(this)
    this.showInput = this.showInput.bind(this)

  }

  handleMessage = (event) => {
    const stateChange = {};
    console.log(event.target.name)
    console.log(event.target.value)
    stateChange[event.target.name] = event.target.value
    this.setState(stateChange)
  }

  showInput = () => {
    this.setState({
      display: 'input'
    }
    )

  }

  showChart = (chart) => {
    this.setState({
      display: chart
    })

  }

  render() {
    console.log(this.state)
    const csGrowth = this.state.csGrowth
    const esGrowth = this.state.esGrowth
    const discountRate = this.state.discountRate
    return (
      <div>
      <h1>Should you go to Grad School? Ducky will tell you ..he he</h1>
      {this.state.display === 'input' &&
      <Form>
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
              label={`And I expect my salary (without grad school) to grow ${csGrowth}% per year`}
              min={-2}
              max={12}
              name='csGrowth'
              onChange={this.handleMessage}
              step={1}
              type='range'
              value={this.state.csGrowth}
            />
        <br />
        <Form.Field className="padding-left">
        <label>Salary After</label>
        <input placeholder='Enter Expected Salary' name='expectedSalary' onChange={this.handleMessage} />
      </Form.Field>
      <Form.Input
              label={`And I expect my salary after grad School to grow ${esGrowth}% per year`}
              min={-2}
              max={12}
              name='esGrowth'
              onChange={this.handleMessage}
              step={1}
              type='range'
              value={esGrowth}
            />
        <br />

      <Form.Field className="padding-left">
        <label>Grad School Takes How Many Years?</label>
        <input type='number' placeholder={3} step={1} name='yearsOfSchool' onChange={this.handleMessage}/>
      </Form.Field>
      <Form.Field className="padding-left">
        <label>Tuition is...</label>
        <input name='tuition' onChange={this.handleMessage}/>
      </Form.Field>
      {/* <Form.Field className="padding-left">
        <label>and my living Expenses are</label>
        <input name='livingExpenes' onChange={this.handleMessage}/>
      </Form.Field> */}
      <Form.Field className="padding-left">
        <label>And I expect to Retire</label>
        <input placeholder='65' name='retirementAge' onChange={this.handleMessage}/>
      </Form.Field>
      <br />
      <Button fluid color="blue" type='button' onClick={()=>this.showChart('chart1')}>See your income projections <Icon name='arrow circle right' /> </Button>
    </Form>
    }
   <br/>
    {this.state.display === 'chart1' && <Chart1 data={this.state}/>}
    {this.state.display === 'chart1' &&
    <Button fluid color='white' onClick={()=>this.showChart('chart2')}><Label color='violet' size='massive'>Check it out on a discounted basis     <Icon name='arrow circle right' /></Label></Button>
    }


    {this.state.display === 'chart2' && <Chart2 data={this.state} /> }
    {this.state.display === 'chart2' &&
    <Form className="padding-left">
            <Form.Input
              label='The discount rate accounts for time value of money. You should also take into account your student loan rate.'
              min={1}
              max={12}
              name='discountRate'
              onChange={this.handleMessage}
              step={0.5}
              type='range'
              value={discountRate}
            />
        <br />
      </Form>
    }
    {this.state.display === 'chart2' && <div>
    <Link to='/me'><Button fluid color='white' onClick={()=>this.showChart('chart1')}><Label color='violet' size='massive'>Go to home page   <Icon name='arrow circle right' /></Label> </Button></Link>
    <Button fluid color='white' onClick={()=>this.showChart('chart1')}><Label color='violet' size='large'><Icon name='arrow circle left' />View your previous chart     </Label> </Button></div>
    }

    {this.state.display !== 'input' && <Button fluid color='white' onClick={()=>this.showInput()}><Label color='violet'  size='medium'> Go back to your inputs </Label></Button>}
    </div>


    )
  }



}


export default connect(null, null)(InputGradSchool)


