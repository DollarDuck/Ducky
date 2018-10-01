import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {getTransactionsByUser, getAllBanks, getTransactionsByBank} from '../store/plaid'
import {Menu, Header, Dropdown} from 'semantic-ui-react'
import {reformatDate, reformatAmount} from '../../utils'

class Transactions extends React.Component {
	componentDidMount() {
		const userId = this.props.match.params.userId
		this.props.getTransactions(userId)
		this.props.getAllBanks(userId)
	}
	handleSelect = event => {
		const userId = this.props.match.params.userId
		this.props.getTransactionsByBank(event.target.value, userId)
	}
	render() {
		if(this.props.transactions.length && this.props.banks.length) {
			return (
				<div>
				 <Menu borderless> 
				     <Menu.Item position="right"></Menu.Item>
				     <Menu.Item position="right"></Menu.Item>
				    <Menu.Item position="right"><Header as='h1'>Accounts</Header></Menu.Item>
				    <Menu.Item position="right">
				      <img src='/duck.svg' />
				    </Menu.Item>
				    <hr />
			   	</Menu>
			   	<h3 />
			   	<div className="ui one column stackable center aligned page grid">
			   		<div className="column twelve wide">
		   			Bank: <Dropdown placeholder='All Banks' selection options={this.props.banks} onChange={this.handleSelect}/>
		   		</div>
		   		</div>
		   		<h3 />
				<table className="ui celled striped table">
					  <thead>
					    <tr><th colspan="3">
					      All Transactions
					    </th>
					  </tr></thead>
					  <tbody>
						  <tr >
						      <td>Transaction Name</td>
						      <td>Transaction Amount</td>
						      <td >Date of Transaction</td>
					    	</tr>
						  	{this.props.transactions.map(transaction => {
						  		return (
									<tr key={transaction.id}>
								      <td>
								        {transaction.name}
								      </td>
								      <td>{reformatAmount(transaction.amount)}</td>
								      <td >{reformatDate(transaction.date)}</td>
								    </tr>
						  		)
						  	})}
	  					</tbody>
					</table>
				</div>
			)
		} else return (
			<h3>Currently, you have no transactions or linked bank accounts</h3>
		);
	}
}

const mapDispatch = dispatch => ({
	getTransactions: (userId) => dispatch(getTransactionsByUser(userId)),
	getAllBanks: userId => dispatch(getAllBanks(userId)),
	getTransactionsByBank: (bank, userId) => dispatch(getTransactionsByBank(bank, userId))
})

const mapState = state => ({
	transactions: state.transactions.transactions,
	banks: state.transactions.banks
})

export default connect(mapState, mapDispatch)(Transactions)