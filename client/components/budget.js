import React from 'react'
import {connect} from 'react-redux'
import {getBudgetFromServer} from '../store/budget'
import {Menu, Header, Button} from 'semantic-ui-react'
import {NavLink} from 'react-router-dom'

const mapState = state => ({
	budget: state.budget,
	user: state.user
})

const mapDispatch = dispatch => ({
	getBudget: (userId) => dispatch(getBudgetFromServer(userId))
})

class Budget extends React.Component {
	componentDidMount() {
		const userId = this.props.user.id
		console.log('userId', userId)
		this.props.getBudget(userId)
	}
	render() {
		if(this.props.budget.budgetItems) {
			const budget = this.props.budget
			return (
				<div>
				 <Menu borderless>
				     <Menu.Item position="right"></Menu.Item>
				     <Menu.Item position="right"></Menu.Item>
				    <Menu.Item position="right"><Header as='h1'>Budget</Header></Menu.Item>
				    <Menu.Item position="right">
				      <img src='/duck.svg' />
				    </Menu.Item>
				    <hr />
			   	</Menu>
			   	<NavLink to="/editBudget"><Button color="blue">Edit Budget</Button></NavLink>
			   		<h3>Income: {budget.income}</h3>
			   		<h3>Percent saved per month: {budget.percentIncomeSaved}</h3>
			   		<h3>Month to Date Spending: {budget.mtdSpending}</h3>
			   		<h3>Total budget: {budget.amount}</h3>
			   		<div>
			   			{budget.budgetItems.map(budgetItem => {
			   				return (
			   					<h3>{budgetItem.categoryId} | {budgetItem.amount} | {budgetItem.mtdSpending} </h3>
			   				)
			   			})}
			   	</div>
			   	</div>
			)
		} else return null
	}
}

export default connect(mapState, mapDispatch)(Budget)