import React from 'react'
import {Grid, Card, Label, Form, Button, Image} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {calculatePlan} from '../store/purchasePlanner'
import {addPurchaseToBudget} from '../store/budget'
import {NavLink} from 'react-router-dom'

//Purchase Planner

//Asks for event that you're going for, estimated cost of event, and when you need the money for
//If unsure, presents options if you need this money now, if you need it in 1, 3, or 6 months
//Returns the cost of what you'll need to save every month and what percentage of your budget this is
//Gives some indicator (x dollars per month means you'd need x less lattes, x less dinners out)
//Can choose whether or not a plan adds to a budget

const mapDispatch = dispatch => ({
	calculatePlan: (formInfo) => dispatch(calculatePlan(formInfo)),
	addPurchaseToBudget: (cost,userId) => dispatch(addPurchaseToBudget(cost, userId))
})

const mapState = state => ({
	plan: state.purchases
})

class PurchasePlanner extends React.Component {
	state = {
		isSubmitted: false,
		isAdded: false
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
		const cost = this.props.plan.costPerMonth
		console.log('cost, userId', cost,userId)
		await this.props.addPurchaseToBudget(cost, userId)
		this.setState({isAdded: true})
	}
	render () {
		return (
		    <div>
		      <h1 />
		      <Grid centered>
		      <Grid.Column centered width={5}>
		      <Card fluid centered color="white">
		      <Label size="massive" color="blue">Purchase Planner</Label>
		      <Label size="medium">Plan your next big purchase!</Label>
		      {this.state.isSubmitted ? 
		      	(
		      		<div>
		      		{!this.state.isAdded ? (
		      			<div>
		      		<Card.Content><Card.Meta><p className="padding black">Based on your {this.props.plan.numMonths} month plan, you'd need to save {this.props.plan.costPerMonth} every month. This would be {this.props.plan.percentageTotalBudget}% of your total monthly budget</p></Card.Meta></Card.Content>
		      		<Card.Content><Card.Meta><p className="padding black">In other terms, this would be about {this.props.plan.numLattes} lattes each month, or {this.props.plan.numLunches} lunches out</p></Card.Meta></Card.Content>
		      		<Image src="/purchaseplanner.jpg" />
		      		<Button fluid color="blue" size ="large" onClick={this.addToBudget}>Add To Budget</Button>
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
		         <Label>If you leave this field blank, we can give you options for immediate purchase, 1, 3, and 6 months.</Label>
		      </Form.Field>     
		      <br />
		            <br />
		      <Button fluid color="blue" type='submit'>Submit</Button>
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