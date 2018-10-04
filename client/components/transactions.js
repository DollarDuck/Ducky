import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {
  getTransactionsByUser,
  getAllBankInfo,
  getTransactionsByBank
} from '../store/plaid'
import {Menu, Header, Dropdown, Label, Grid} from 'semantic-ui-react'
import {reformatDate, reformatAmount} from '../../utils'

class Transactions extends React.Component {

	componentDidMount() {
    const userId = this.props.user.id
    this.props.getTransactions(userId)
    this.props.getAllBankInfo(userId)
  }
  handleSelect = (event, data) => {
    const userId = this.props.match.params.userId
    if (data.value === 'allBanks') {
      this.props.getTransactions(userId)
    } else {
      this.props.getTransactionsByBank(userId, data.value)
    }
  }
  render() {
    if (this.props.transactions.length && this.props.accounts.length) {
      const accounts = this.props.accounts.concat([
        {text: 'All Accounts', value: 'allBanks'}
      ])
      return (
        <div>
          <h3 />
          <div className="ui one column stackable center aligned page grid">
            <div className="column twelve wide">
              Bank:{' '}
              <Dropdown
                placeholder="All Banks"
                selection
                options={accounts}
                onChange={this.handleSelect}
              />
              <br />
              <br />
            </div>
          </div>
          <h3 />
          <table className="ui celled striped table">
            <thead>
              <tr>
                <th>Transaction Name</th>
								<th>Transaction Amount</th>
								<th>Date of Transaction</th>
              </tr>
            </thead>
            <tbody>
              {this.props.transactions.map(transaction => {
                return (
                  <tr key={transaction.id}>
                    <td>{transaction.name}</td>
                    <td>{reformatAmount(transaction.amount)}</td>
                    <td>{reformatDate(transaction.date)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    } else
      return (
        <div>
          <h3 />
          <Grid centered width={7}>
            <h3>
              Currently, you have no transactions or linked bank accounts.
              You'll want to enter your user profile to add in a bank account.
            </h3>
          </Grid>
        </div>
      )
  }
}

const mapDispatch = dispatch => ({
  getTransactions: userId => dispatch(getTransactionsByUser(userId)),
  getAllBankInfo: userId => dispatch(getAllBankInfo(userId)),
  getTransactionsByBank: (userId, accountId) =>
    dispatch(getTransactionsByBank(userId, accountId))
})

const mapState = state => ({
  transactions: state.transactions.transactions,
	accounts: state.transactions.accounts,
	user: state.user
})

export default connect(mapState, mapDispatch)(Transactions)
