import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Item, Form, Button, Grid, Checkbox, Card, Label, Icon, Container, Message, Header} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import Chart1 from './chart1'
import Chart2 from './chart2'
import {dataProcessor} from '../../../../utils'

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
    })
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
    const chartData = dataProcessor(this.state)
    const headerMessage = headerMessageFunc(chartData.breakevenNPV)
    return (
      <div>
      <Header as='h1' className="padding-left">Should you go to Grad School? Ducky will tell you!</Header>
      {this.state.display === 'input' &&
      <Form>
      <Form.Field className="padding-left">
        <label>My Age</label>
        <input placeholder='Enter Age' name='age' defaultValue={25} type='number' onChange={this.handleMessage} />
      </Form.Field>
      <br />
      <Form.Field className="padding-left">
        <label>Current Annual Salary (Without Grad School)</label>
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
              className="padding-left"
            />
        <br />
        <Form.Field className="padding-left">
        <label>Annual Salary Expected After Grad School</label>
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
              className="padding-left"
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
    <Button fluid color='white' onClick={()=>this.showChart('chart2')}><Label color='violet' size='massive'>Check out what it would look like with interest rates on mone     <Icon name='arrow circle right' /></Label></Button>
    }


    {this.state.display === 'chart2' && 
         <div>
        <Message color={headerMessage.color} >
      <Item.Group>
      <Item color={headerMessage.color} >
      <Item.Image src="/clipartduck1.png" size="small" />
      <Item.Content verticalAlign='middle'>
      <Item.Header as='a'>
        {headerMessage.header}
      </Item.Header>
      <p> - Professor Ducky </p>
      </Item.Content>
      </Item>
      </Item.Group>
      </Message>
      <br />
      <Grid centered>
      <Grid.Column centered width={6}>
      <Grid.Column centered width={4}>
      <h3>Chart based on a interest rate of {this.state.discountRate} % </h3>
      </Grid.Column>
      <br />
      <Form>
            <Form.Input
              label='The interest rate accounts for the interest collected on any money borrowed per year'
              max={12}
              name='discountRate'
              step={0.5}
              type='range'
              onChange={this.handleMessage}
              value={this.state.discountRate}
            />
      </Form>
      </Grid.Column>
      </Grid>
      <Chart2 data={this.state} /> 
      </div>}
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

function headerMessageFunc(years) {
  let returnObj = {}
  if (years < 8 && years > 0) {
    returnObj.color = 'green'
    returnObj.header = 'Dear Little Duckling: Grad school is a wise investment for you!'
  } else if (years<12 && years>0) {
    returnObj.color='olive'
    returnObj.header = 'Grad school will take around a decade to pay off but could be a wise choice'
  }
    else if (years < 18 && years > 0) {
    returnObj.color = 'blue'
    returnObj.header = 'Grad school will take time to make sense financially but the logic is there'
  } else if (years >= 18 || !years ) {
    returnObj.color = 'red'
    returnObj.header = 'Grad school tuition is not a good idea for your wallet!'
  } else {
    returnObj.color = 'violet'
    returnObj.header = 'I am Professor Ducky!'
  }
  return returnObj
}


