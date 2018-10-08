import React from 'react'
import {Grid, Card, Label, Form, Button, Image} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {calculatePlan, clearState} from '../store/purchasePlanner'
import {addPurchaseToBudget} from '../store/budget'
import {NavLink} from 'react-router-dom'

const mapDispatch = dispatch => ({
	calculatePlan: (formInfo) => dispatch(calculatePlan(formInfo)),
	addPurchaseToBudget: (cost,userId) => dispatch(addPurchaseToBudget(cost, userId)),
	clearState: () => dispatch(clearState())
})

const mapState = state => ({
	singlePlan: state.purchases.singleOption,
	multiplePlan: state.purchases.multipleOptions
})

class PurchasePlanner extends React.Component {
	state = {
		isSubmitted: false,
		isAdded: false,
	}
	componentDidMount() {
		this.props.clearState()
	}
	handleSubmit = async (event) => {
    const userId = this.props.match.params.userId
		const formInfo = {
      		userId: userId,
      		purchaseName: event.target.purchaseName.value,
      		totalCost: event.target.totalCost.value,
      		numMonths: event.target.numMonths.value
		}
		await this.props.calculatePlan(formInfo)
		this.setState({ isSubmitted: true})
	}
	addToBudget = async () => {
		const userId = this.props.match.params.userId
		const cost = this.props.singlePlan.costPerMonth
		await this.props.addPurchaseToBudget(cost, userId)
		this.setState({isAdded: true})
	}
	render () {
		return (
		    <div>
		      <h1 />
		      <Grid centered>
		      <Grid.Column centered width={5}>
		      <Card fluid centered>
		      <Label size="massive" >Purchase Planner</Label>
		      <Label size="medium">Plan your next big purchase!</Label>
		      {this.state.isSubmitted ?
		      	(
		      		<div>
		      		{!this.state.isAdded  ? (
		      			<div>
		      			{!this.props.multiplePlan.length ? (
		      			<div>
		      		<Card.Content><Card.Meta><p className="padding black">Based on your {this.props.singlePlan.numMonths} month plan, you'd need to save {this.props.singlePlan.costPerMonth} every month. This would be {this.props.singlePlan.percentageTotalBudget}% of your total monthly budget</p></Card.Meta></Card.Content>
		      		<Card.Content><Card.Meta><p className="padding black">In other terms, this would be about {this.props.singlePlan.numLattes} lattes each month, or {this.props.singlePlan.numLunches} lunches out</p></Card.Meta></Card.Content>
		      		<Image src="/purchaseplanner.jpg" />
		      		<Button fluid size ="large" onClick={this.addToBudget}>Add To Budget</Button>
		      		<NavLink to="/me"><Button fluid color="grey" size ="large">Skip and return to Home</Button></NavLink>
		      		</div>
		      		) : (
		      			<div>
		      				<Card.Content><Card.Meta><p className="padding black">Here are several options on how you can save for this purchase:</p></Card.Meta></Card.Content>
		      				{this.props.multiplePlan.map((plan) => {
		      					return (
		      						<div key={plan.costPerMonth}>
		      							<Grid.Column centered width={5}>
		      							<Card fluid>
		      							<Card.Content><Card.Meta><p className="padding black">Based on a {plan.numMonths} month plan, you'd need to save {plan.costPerMonth} every month. This would be {plan.percentageTotalBudget}% of your total monthly budget</p></Card.Meta></Card.Content>
				      					<Card.Content><Card.Meta><p className="padding black">In other terms, this would be about {plan.numLattes} lattes each month, or {plan.numLunches} lunches out</p></Card.Meta></Card.Content>
		      							<Button size ="large" onClick={this.addToBudget}>Add To Budget</Button>
		      							</Card>
		      							</Grid.Column>
		      							<br />
		      						</div>
		      				)
		      				})}
		      				<NavLink to="/me"><Button fluid color="grey" size ="large">Skip and return to Home</Button></NavLink>
				      	</div>

		      		)}
		      		</div>
		      		) : (
		      		<div>
		      		<Card.Content><Card.Meta><h2 className="padding black">Purchase added to budget</h2></Card.Meta></Card.Content>
		      		<NavLink to="/me"><Button fluid color="blue" size ="large">Back to Home</Button></NavLink>
		      		</div>
		      		)}
		      		</div>
		      	) : (
		      		<div>
		      <h1 />
		      <Form onSubmit={this.handleSubmit}>
		      <Form.Field className="padding-large" width={12}>
		        <label>Purchase name:</label>
		        <input placeholder='Name' name='purchaseName'/>
		      </Form.Field>
		      <br />
		      <Form.Field className="padding-large" width={12}>
		        <label>Estimated total cost:</label>
		        <input placeholder='Total Cost' name='totalCost'/>
		      </Form.Field>
		      <br />
		            <br />
		      <Form.Field className="padding-large" width={12}>
		        <label>How many months do you have to save for this?</label>
		        <input placeholder='Number of Months' name='numMonths'/>
		         <Label>If you leave this field blank, we can give you options for purchasing in 1, 3, and 6 months.</Label>
		      </Form.Field>
		      <br />
		            <br />
		      <Button fluid type='submit'>Submit</Button>
		      </Form>
		      </div>
		      )}
		      </Card>
		      </Grid.Column>
		      </Grid>
     		 </div>
      )
	}
}

export default connect(mapState, mapDispatch)(PurchasePlanner)
