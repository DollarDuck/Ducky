import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  Item,
  Form,
  Button,
  Grid,
  Divider,
  Label,
  Icon,
  Container,
  Segment,
  Message,
  Header,
  Popup
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import Chart1 from './chart1'
import Chart2 from './chart2'
import {dataProcessor} from '../../../../utils'

class InputGradSchool extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
    }
    this.handleMessage = this.handleMessage.bind(this)
    this.showChart = this.showChart.bind(this)
    this.showInput = this.showInput.bind(this)
  }

  handleMessage = event => {
    const stateChange = {}
    stateChange[event.target.name] = event.target.value
    this.setState(stateChange)
  }

  showInput = () => {
    this.setState({
      display: 'input'
    })
  }

  showChart = chart => {
    this.setState({
      display: chart
    })
  }

  render() {
    const csGrowth = this.state.csGrowth
    const esGrowth = this.state.esGrowth
    const chartData = dataProcessor(this.state)
    const headerMessage = headerMessageFunc(chartData.breakevenNPV)

    return (
      <Grid centered>
        <Divider hidden />
        <Divider hidden />
        {this.state.display === 'input' && (
          <Segment padded>
            <Header as="h1">
              Should you go to Grad School? Ducky will tell you!
            </Header>
            <Form>
              <Form.Field>
                <label>My Age</label>
                <input
                  placeholder="Enter Age"
                  name="age"
                  defaultValue={25}
                  type="number"
                  onChange={this.handleMessage}
                />
              </Form.Field>
              <br />
              <Form.Field>
                <label>Current Annual Salary</label>
                <input
                  placeholder="Enter Current Salary"
                  name="currentSalary"
                  onChange={this.handleMessage}
                />
              </Form.Field>
              <Form.Input
                label={`And I expect my salary without grad school to grow ${csGrowth}% per year`}
                min={-2}
                max={12}
                name="csGrowth"
                onChange={this.handleMessage}
                step={1}
                type="range"
                value={this.state.csGrowth}
                className="padding-left"
              />
              <br />
              <Form.Field>
                <label>Annual Salary Expected After Grad School</label>
                <input
                  placeholder="Enter Expected Salary"
                  name="expectedSalary"
                  onChange={this.handleMessage}
                />
              </Form.Field>
              <Form.Input
                label={`And I expect my salary after grad school to grow ${esGrowth}% per year`}
                min={-2}
                max={12}
                name="esGrowth"
                onChange={this.handleMessage}
                step={1}
                type="range"
                value={esGrowth}
                className="padding-left"
              />
              <br />

              <Form.Field>
                <label>Grad School Takes How Many Years?</label>
                <input
                  type="number"
                  placeholder={3}
                  step={1}
                  name="yearsOfSchool"
                  onChange={this.handleMessage}
                />
              </Form.Field>
              <Form.Field className="padding-left">
                <label>Tuition is...</label>
                <input name="tuition" onChange={this.handleMessage} />
              </Form.Field>
              <Form.Field className="padding-left">
                <label>And I expect to Retire</label>
                <input
                  placeholder="65"
                  name="retirementAge"
                  onChange={this.handleMessage}
                />
              </Form.Field>
              <br />
              <Button
                fluid
                type="button"
                onClick={() => this.showChart('chart1')}
              >
                See your income projections <Icon name="arrow circle right" />{' '}
              </Button>
            </Form>
          </Segment>
        )}
        <br />
        {this.state.display === 'chart1' && (
          <Container>
            <Divider hidden />
            <Divider hidden />
          <Segment>
            <Chart1 data={this.state} />
            <Divider hidden />
            <Button
              padded
              onClick={() => this.showChart('chart2')}
              size="huge"
            >
              Show me with interest rates included{' '}
              <Icon name="arrow circle right" />
            </Button>
            <Divider hidden />
            <Button onClick={() => this.showInput()} size="medium">
              {' '}
              Go back to your inputs{' '}
            </Button>
        </Segment>
          </Container>
        )}

        <Container>
          {this.state.display === 'chart2' && (
          <Segment>
            <div>
              <Divider hidden />
              <Message color={headerMessage.color}>
                <Item.Group>
                  <Item color={headerMessage.color}>
                    <Item.Image src="/clipartduck1.png" size="small" />
                    <Item.Content verticalAlign="middle">
                      <Item.Header as="a">{headerMessage.header}</Item.Header>
                      <p> - Professor Ducky </p>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Message>
              <br />

              <h3>
                Chart based on an interest rate of {this.state.discountRate} %{' '}
              </h3>

              <br />
              <Form>
                <Form.Input
                  label="The interest rate accounts for the interest collected per year on any money borrowed"
                  max={12}
                  name="discountRate"
                  step={0.5}
                  type="range"
                  onChange={this.handleMessage}
                  value={this.state.discountRate}
                />
              </Form>

              <Popup
                trigger={
                  <Label style={{marginLeft: '1rem'}} circular float="right">
                    ?
                  </Label>
                }
                content="Cumulative net present value represents the value of your stream of future income."
              />
              <Chart2 data={this.state} />
            </div>
            <div>
              <Button size="large" onClick={() => this.showChart('chart1')}>
                <Icon name="arrow circle left" />View your previous chart{' '}
              </Button>

              <Button
                as={Link}
                to={`/budget/${this.props.user.id}`}
                size="large"
                onClick={() => this.showChart('chart1')}
              >
                Return to Budget <Icon name="arrow circle right" />{' '}
              </Button>

              <Divider hidden />
            </div>
            <Button onClick={() => this.showInput()} size="medium">
              {' '}
              Go back to your inputs{' '}
            </Button>
              </Segment>
          )}

          <Divider hidden />
        </Container>
      </Grid>
    )
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}

export default connect(mapState, null)(InputGradSchool)

function headerMessageFunc(years) {
  let returnObj = {}
  if (years < 8 && years > 0) {
    returnObj.color = 'green'
    returnObj.header =
      'Dear Little Duckling: Grad school is a wise investment for you!'
  } else if (years < 12 && years > 0) {
    returnObj.color = 'olive'
    returnObj.header =
      'Grad school will take around a decade to pay off, but could be a wise choice'
  } else if (years < 18 && years > 0) {
    returnObj.color = 'blue'
    returnObj.header =
      'Grad school will take time to make sense financially but the logic is there.'
  } else if (years >= 18 || !years) {
    returnObj.color = 'red'
    returnObj.header = 'Grad school tuition is not a good idea for your wallet!'
  } else {
    returnObj.color = 'violet'
    returnObj.header = 'I am Professor Ducky!'
  }
  return returnObj
}
