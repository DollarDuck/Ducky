import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {getTransactionsByUser, getAllBankInfo, getTransactionsByBank} from '../store/plaid'
import {Menu, Header, Dropdown, Label} from 'semantic-ui-react'
import {reformatDate, reformatAmount} from '../../utils'

class Transactions extends React.Component {
	componentDidMount() {
		const userId = this.props.match.params.userId
		this.props.getTransactions(userId)
		this.props.getAllBankInfo(userId)
	}
	handleSelect = (event,data) => {
		const userId = this.props.match.params.userId
		if(data.value === 'allBanks') {
			this.props.getTransactions(userId)
		} else {
			this.props.getTransactionsByBank(userId, data.value)
		}
	}
	render() {
		if(this.props.transactions.length && this.props.accounts.length) {
			const accounts = this.props.accounts.concat([{text: 'All Accounts', value: 'allBanks'}])
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
		   			Bank: <Dropdown placeholder='All Banks' selection options={accounts} onChange={this.handleSelect}/>
						 <br />
						 <br />
						 <Link to="/balances"><Label color='teal'>See your account balances</Label></Link>
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
	getAllBankInfo: userId => dispatch(getAllBankInfo(userId)),
	getTransactionsByBank: (userId, accountId) => dispatch(getTransactionsByBank(userId, accountId))
})

const mapState = state => ({
	transactions: state.transactions.transactions,
	accounts: state.transactions.accounts
})

export default connect(mapState, mapDispatch)(Transactions)
