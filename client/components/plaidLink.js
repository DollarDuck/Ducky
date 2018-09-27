import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios'
import {connect} from 'react-redux'
const {getTransactions} = require('../../secrets')


const mapStateToProps = state => ({
  user: state.user
})


class Plaid extends Component {
  async handleOnSuccess(token, metadata) {
    await axios.post('/api/plaid/saveToken', {token: token, institution: metadata.institution.name})
  }
  handleClick = async () => {
    const userId = this.props.user.id
    const transactions = await getTransactions(userId)
    console.log(transactions)
  }
  render() {
    console.log(getTransactions)
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

export default connect(mapStateToProps)(Plaid)


