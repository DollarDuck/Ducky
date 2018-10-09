import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {
  getTransactionsByUser,
  getAllBankInfo,
  getTransactionsByBank
} from '../store/plaid'
import {Menu, Header, Dropdown, Label, Grid, Icon} from 'semantic-ui-react'
import {reformatDate, reformatAmount, commaFormat, ensureTwoDecimals} from '../../utils'

class Transactions extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      sorted: false,
      nameSort: false,
      amountSort: false,
      dateSort: false
    }
    this.handleSort = this.handleSort.bind(this)
  }

	componentDidMount() {
    const userId = this.props.user.id
    this.props.getTransactions(userId)
    this.props.getAllBankInfo(userId)
  }

  handleSort = (field) => {
    let stateChange = {}
    stateChange.sorted = field
    // if (field !== 'name') { stateChange.nameSort = false }
    // if (field !== 'amount') { stateChange.amountSort = false}
    // if (field !== 'date') { stateChange.dateSort = false }
    stateChange[field+'Sort'] = !this.state[field+'Sort']
    this.setState(stateChange)

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
    let transactions = this.props.transactions
    if(this.state.sorted) {
      const x = sortFunc(transactions, this.state)
      transactions = x
    }

    if (transactions.length) {
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
                <th onClick={()=>this.handleSort('name')}>Transaction Name
                {this.state.sorted === 'name' ? (
                (this.state.nameSort === false) ?
                <Icon name='sort down' /> : <Icon name='sort up' /> ) :
                <Icon name='sort' />}
                </th>
								<th onClick={()=>this.handleSort('amount')}>Transaction Amount
                {this.state.sorted === 'amount' ? (
                (this.state.amountSort === false) ?
                <Icon name='sort down' /> : <Icon name='sort up' />) :  <Icon name='sort'/>}
                </th>
								<th onClick={()=>this.handleSort('date')}>Date of Transaction
                {this.state.sorted === 'date' ? (
                (this.state.dateSort === false) ?
                <Icon name='sort down' /> : <Icon name='sort up' />) :  <Icon name='sort' />}
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => {
                return (
                  <tr key={transaction.id}>
                    <td>{transaction.name}</td>
                    <td>{ensureTwoDecimals(commaFormat(transaction.amount))}</td>
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

export default withRouter(connect(mapState, mapDispatch)(Transactions))


function sortFunc(transactions, state) {
  const item = state.sorted
  const isAscending = (state[item+'Sort']) ? 1 : -1

  const x = transactions.sort(function(a, b){
    if (item === 'name') {
      if(a[item] > b[item]) {return isAscending}
      if(a[item] < b[item]) {return -1*isAscending}
      return 0
    }

    if (item ==='date') {
      if(Date.parse(a[item]) > Date.parse(b[item])) {return isAscending}
      if(Date.parse(a[item]) < Date.parse(b[item])) {return -1*isAscending}
      return 0
    }

    if (item ==='amount') {
      if(Number(a[item]) > Number(b[item])) {return isAscending}
      if(Number(a[item]) < Number(b[item])) {return -1*isAscending}
      return 0
    }
  })
  return x

}
