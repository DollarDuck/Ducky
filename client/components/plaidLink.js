import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios'
import {connect} from 'react-redux'
import {getTransactions, getBalances} from '../store/plaid'
import {updateUser} from '../store/user'
import {get30DaysAgo} from '../../utils'
import {auth} from '../store'

const mapStateToProps = state => ({
  user: state.user,
  transactions: state.transactions.transactions,
  balances: state.transactions.balances
})

const mapDispatchToProps = dispatch => ({
  getTransactions: (userId, lastUpdateDate, token, institution) => dispatch(getTransactions(userId, lastUpdateDate, token, institution)),
  getBalances: (userId, token, institution) => dispatch(getBalances(userId, token, institution)),
  updateUser: userId => dispatch(updateUser(userId))
})


class Plaid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      accountLinked: false
    }

  }

  handleOnSuccess = async (token, metadata) => {
    const userId = this.props.user.id
    const lastUpdateDate = get30DaysAgo()
    await this.props.getTransactions(userId, lastUpdateDate, token, metadata.institution.name)
    await this.props.getBalances(userId, token, metadata.institution.name)
    await this.props.updateUser(userId)
    this.setState({ accountLinked: true})
  }
  render() {
    if(!this.state.accountLinked) {
    return (
      <div>
      <PlaidLink
        clientName="Plaid Client"
        env="sandbox"
        product={['auth', 'transactions']}
        publicKey="2e86ad2a3b3a35d15f0112504ac7d3"
        apiVersion="v2"
        onSuccess={this.handleOnSuccess}>
        Link your bank account
      </PlaidLink>
      <a href="/home">Skip this step</a>
      </div>
    );
  } else {
    return <h3>Bank account submitted</h3>
  }
}

}

export default connect(mapStateToProps, mapDispatchToProps)(Plaid)


