import React from 'react'
import {Segment, Grid, Card, Label, Form, Button, Image, Icon} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {calculatePlan, clearState} from '../store/purchasePlanner'
import {addPurchaseToBudget} from '../store/budget'
import {NavLink, Link} from 'react-router-dom'
import {commaFormat, ensureTwoDecimals} from '../../utils'

const mapDispatch = dispatch => ({
	calculatePlan: (formInfo) => dispatch(calculatePlan(formInfo)),
	addPurchaseToBudget: (cost,userId) => dispatch(addPurchaseToBudget(cost, userId)),
	clearState: () => dispatch(clearState())
})

const mapState = state => ({
	user: state.user,
	singlePlan: state.purchases.singleOption,
	multiplePlan: state.purchases.multipleOptions
})


class PurchasePlanner extends React.Component {
	state = {
		isSubmitted: false,
		isAdded: false,
		compareArr: [],
		compareName: ''
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
		let latteArray = []
		const numLattes = this.props.singlePlan.numLattes
		latteArray = Array(numLattes).fill('/latte.png')
		this.setState({ isSubmitted: true,
						compareArr: latteArray,
						compareName: `${numLattes} lattes per month`
					})

	}
	switchLeft = () => {
		const numLunches = this.props.singlePlan.numLunches
		const lunchesArray = Array(numLunches).fill('/lunches.png')
		this.setState({ compareArr: lunchesArray,
						compareName: `${numLunches} lunches out per month`})
	}
	switchRight = () => {
		const numLattes = this.props.singlePlan.numLattes
		const latteArray = Array(numLattes).fill('/latte.png')
		this.setState({
						compareArr: latteArray,
						compareName: `${numLattes} lattes per month`
					})
	}
	addToBudget = async (plan) => {
		const userId = this.props.match.params.userId
		const cost = plan.costPerMonth
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
		      <Label size="massive" ><h2 className="font-header">Purchase Planner</h2></Label>
		      <div className="padding-left">
		      </div>
		      {this.state.isSubmitted ?
		      	(
		      		<div>
		      		{!this.state.isAdded  ? (
		      			<div>
		      			{!this.props.multiplePlan.length ?
		      			(
		      			<div>
		      		<Card.Content><Card.Meta><p className="padding black">Based on your {this.props.singlePlan.numMonths} month plan, you'd need to save {ensureTwoDecimals(commaFormat(this.props.singlePlan.costPerMonth))} every month. This would be {this.props.singlePlan.percentageTotalBudget}% of your total monthly budget</p></Card.Meta></Card.Content>
		      		<Card.Content><Card.Meta><p className="padding black">In other terms, this would be about:</p></Card.Meta></Card.Content>		      		<Grid.Row centered width={2}>
		      		{this.state.compareName.includes('lattes') ? (<div onClick={this.switchLeft} className="padding-icon-left">
		      			<Icon name="chevron left" />
		      		</div>
		      		) : '     '}
		      		<Grid.Column>
		      		<div className={this.state.compareName.includes('lunches') ? "padding-left-icon" : ''}>
		      		<Card centered width={1}>
		      		<Label fluid size="big">{this.state.compareName}</Label>
		      		<br />
		      		<Grid.Row>
		      		{this.state.compareArr.map((compareItem) => {
		      			return <img src={compareItem} className="emoji-size"/>
		      		})}
		      		</Grid.Row>
		      		</Card>
		      		</div>
		      		</Grid.Column>
		      		{this.state.compareName.includes('lunches') ? (
		      		<div onClick={this.switchRight} className="padding-icon-right">
		      			<Icon name="chevron right" />
		      		</div>
		      		): '     '}
		      		</Grid.Row>
		      		<h1 />
		      		<Button fluid size ="large" onClick={() => this.addToBudget(this.props.singlePlan)}>Add To Budget</Button>
		      		<NavLink to={`/budget/${this.props.user.id}`}><Button fluid color="grey" size ="large">Skip and return to Budget</Button></NavLink>
		      		</div>
		      		) : (
		      			<div>
		      				<Card.Content><Card.Meta><p className="padding black">Here are several options on how you can save for this purchase:</p></Card.Meta></Card.Content>
		      				<Grid.Row>
		      				{this.props.multiplePlan.map((plan) => {
		      					return (
		      						<div key={plan.costPerMonth}>
		      							<Grid.Column centered width={5}>
		      							<Card fluid>
		      							<Card.Content><Card.Meta><p className="padding black">Based on a {plan.numMonths} month plan, you'd need to save {plan.costPerMonth} every month. This would be about {plan.percentageTotalBudget}% of your total monthly budget</p></Card.Meta></Card.Content>
				      					<Card.Content><Card.Meta><p className="padding black">In other terms, this would be about {plan.numLattes} lattes each month, or {plan.numLunches} lunches out</p></Card.Meta></Card.Content>
		      							<Button size ="large" onClick={() => this.addToBudget(plan)}>Add To Budget</Button>
		      							</Card>
		      							</Grid.Column>
		      							<br />
		      						</div>
		      				)
		      				})}
		      				</Grid.Row>
		      				<NavLink to={`/budget/${this.props.user.id}`}><Button fluid color="grey" size ="large">Skip and return to Budget</Button></NavLink>
				      	</div>

		      		)}
		      		</div>
		      		) : (
		      		<div>
		      		<Card.Content><Card.Meta><h4 className="padding black bold font-body">Purchase added to budget</h4></Card.Meta></Card.Content>
		      		<Button as={Link} to={`/budget/${this.props.user.id}`} fluid size ="large">See my new budget</Button>
		      		</div>
		      		)}
		      		</div>
		      	) : (
		      		<div>
		      		<Card.Header><h4 className="padding-left font-body">Plan your next big purchase!</h4></Card.Header>
		      <h3 />
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
