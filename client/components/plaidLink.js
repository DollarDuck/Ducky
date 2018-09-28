import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios'
import {connect} from 'react-redux'
import {getTransactions} from '../store/plaid'
import {updateUser} from '../store/user'
import {get30DaysAgo} from '../../utils'


const mapStateToProps = state => ({
  user: state.user,
  transactions: state.transactions
})

const mapDispatchToProps = dispatch => ({
  getTransactions: (userId, lastUpdateDate) => dispatch(getTransactions(userId, lastUpdateDate)),
  updateUser: userId => dispatch(updateUser(userId))
})


class Plaid extends Component {
  async handleOnSuccess(token, metadata) {
    await axios.post('/api/plaid/saveToken', {token: token, institution: metadata.institution.name})
  }
  handleClick = async () => {
    const userId = this.props.user.id
    const lastUpdateDate = this.props.user.lastUpdated ? this.props.user.lastUpdated : get30DaysAgo()
    console.log('lastUpdateDate', lastUpdateDate)
    await this.props.getTransactions(userId, lastUpdateDate)
    await this.props.updateUser(userId)
    console.log('user', this.props.user)
    console.log('transactions', this.props.transactions)
  }
  render() {
    return (
      <div>
      <button type="button" onClick={this.handleClick}>Generate transactions</button>
      <PlaidLink
        clientName="Plaid Client"
        env="sandbox"
        product={['auth', 'transactions']}
        publicKey="2e86ad2a3b3a35d15f0112504ac7d3"
        apiVersion="v2"
        onSuccess={this.handleOnSuccess}>
        Open Plaid Link button
      </PlaidLink>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Plaid)


