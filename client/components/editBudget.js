import React from 'react'
import {Form, Grid, Card, Button, Label, Accordion, Icon} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {updateBudgetItems} from '../store/budget'
import {commaFormat} from '../../utils'


const mapState = state => ({
  user: state.user
})

const mapDispatch = dispatch => ({
  updateBudgetItems: (updateInfo) => dispatch(updateBudgetItems(updateInfo))
})

class EditBudget extends React.Component {
  state = {
    totalBudget: 0,
    monthlyExpenses: 0,
    shopping: 0,
    travel: 0,
    recreation: 0,
    savings: 0,
    food: 0,
    other: 0,
    activeIndex: -1
  }
  componentDidMount () {
    const budget = this.props.budget
    const budgetItems = this.props.budget.budgetItems.sort((a, b) => {return (Number(a.categoryId) - Number(b.categoryId))})
    this.setState({
      totalBudget: budget.income,
      monthlyExpenses: budgetItems[0].amount,
      shopping: budgetItems[1].amount,
      travel: budgetItems[2].amount,
      recreation: budgetItems[3].amount,
      savings: budgetItems[5].amount,
      other: budgetItems[4].amount,
      food: budgetItems[6].amount
    })
  }
  handleClick = (e, titleProps) => {
    const {index} = titleProps
    const activeIndex = this.state.activeIndex
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex})
  }
  handleChange = (event) => {
    const newOther = Number(this.state.other) + (Number(this.state[event.target.name]) - Number(event.target.value))
    this.setState({ [event.target.name] : event.target.value,
      other: newOther})
  }
  handleChangeTotal = (event) => {
        const newOther = Number(this.state.other) + (Number(event.target.value) - Number(this.state[event.target.name]))
    this.setState({ [event.target.name] : event.target.value,
      other: newOther})
  }
	handleSubmit = () => {
    const budgetId = this.props.budget.id
    const userId = this.props.user.id
    const info = this.state
    info.budgetId = budgetId
    info.userId = userId
		this.props.updateBudgetItems(info)
	}
	render () {
    const state = this.state
    const activeIndex = this.state.activeIndex
		return (
		      <div>
      <h1 />
      <Grid centered>
      <Grid.Column centered width={7}>
      <Accordion>
      <Card fluid>
      <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
        <Icon name="dropdown" />
        <Label size="massive" color="white">Edit budget</Label>
      </Accordion.Title>
      <Accordion.Content active={this.state.activeIndex === 0}>
      <h1 />
       <Grid.Column centered width={7}>
      <Form fluid onSubmit={this.handleSubmit}>
        <Form.Input className="padding"
          fluid
          label=<h1>{`Total Budget - ${commaFormat(state.totalBudget)}`}</h1>
          min={0}
          max={20000}
          value={state.totalBudget}
          name='totalBudget'
          onChange={this.handleChangeTotal}
          step={10}
          type='range'
        />
      <br />
      <Grid.Column centered>
        <Form.Input className="padding"
          label={`Monthly Expenses - ${commaFormat(state.monthlyExpenses)}`}
          min={0}
          max={(Number(state.monthlyExpenses) + Number(state.other))}
          value={state.monthlyExpenses}
          name='monthlyExpenses'
          onChange={this.handleChange}
          step={10}
          type='range'
        />
        </Grid.Column>
        <Grid.Column centered>
        <Form.Input className="padding"
          label={`Shopping - ${commaFormat(state.shopping)}`}
          min={0}
          max={(Number(state.shopping) + Number(state.other))}
          value={state.shopping}
          name='monthlyExpenses'
          onChange={this.handleChange}
          step={10}
          type='range'
        />
        </Grid.Column>
        <Grid.Column centered>
        <Form.Input className="padding"
          label={`Travel - $${state.travel}`}
          min={0}
          max={(Number(state.travel) + Number(state.other))}
          value={state.travel}
          name='travel'
          onChange={this.handleChange}
          step={10}
          type='range'
        />
        </Grid.Column>
        <Grid.Row>
        <Grid.Column centered>
        <Form.Input className="padding"
          label={`Recreation - ${commaFormat(state.recreation)}`}
          min={0}
          max={(Number(state.recreation) + Number(state.other))}
          value={state.recreation}
          name='recreation'
          onChange={this.handleChange}
          step={10}
          type='range'
        />
        </Grid.Column>
        <Grid.Column centered>
        <Form.Input className="padding"
          label={`Savings - ${commaFormat(state.savings)}`}
          min={0}
          max={(Number(state.savings) + Number(state.other))}
          value={state.savings}
          name='savings'
          onChange={this.handleChange}
          step={10}
          type='range'
        />
        </Grid.Column>
        <Grid.Column centered>
        <Form.Input className="padding"
          label={`Food - ${commaFormat(state.food)}`}
          min={0}
          max={(Number(state.food) + Number(state.other))}
          value={state.food}
          name='food'
          onChange={this.handleChange}
          step={10}
          type='range'
        />
        <br />
        </Grid.Column>
        </Grid.Row>
        <Grid.Column centered className="padding">
        <h5>Other = {commaFormat(this.state.other)}</h5>
        </Grid.Column>
      <Button fluid type='submit'>Submit</Button>
      </Form>
      </Grid.Column>
      </Accordion.Content>
      </Card>
      </Accordion>
      </Grid.Column>
      </Grid>
      </div>
      )
	}
}

export default connect(mapState, mapDispatch)(EditBudget)
