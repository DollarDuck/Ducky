import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios'
import {connect} from 'react-redux'
import {getTransactions, getBalances} from '../store/plaid'
import {updateUser} from '../store/user'
import {get30DaysAgo} from '../../utils'
import {auth} from '../store'
import {NavLink} from 'react-router-dom'
import {Label, Dimmer, Loader} from 'semantic-ui-react'

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
      startLoading: false,
      accountLinked: false
    }

  }

  handleOnSuccess = async (token, metadata) => {
    this.setState({startLoading: true})
    const userId = this.props.user.id
    const lastUpdateDate = get30DaysAgo()
    await this.props.getTransactions(userId, lastUpdateDate, token, metadata.institution.name)
    await this.props.getBalances(userId, token, metadata.institution.name)
    await this.props.updateUser(userId)
    this.setState({ accountLinked: true})
  }
  render() {
    if(!this.state.startLoading) {
    return (
      <div>
        <h1 />
          <div className="ui one column stackable center aligned page grid">
            <div className="column twelve wide">
              <div className="ui fluid white card" >
                <div className="height">
                  <h1 />
                  <h1 />
                  <h1 />
                  <PlaidLink
                  clientName="Plaid Client"
                  env="sandbox"
                  product={['auth', 'transactions']}
                  publicKey="2e86ad2a3b3a35d15f0112504ac7d3"
                  apiVersion="v2"
                  onSuccess={this.handleOnSuccess}>
                  <Label color="blue"><h2>Link your bank account</h2></Label>
                  </PlaidLink>
                  <h3 />
                  {this.props.isOnboarding ? <NavLink to="/home"><h3>Skip this step</h3></NavLink> : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      console.log('here', this.state.accountLinked, this.state.startLoading)
      if(!this.state.accountLinked) {
        return(
        <div>
        <h1 />
        <div className="ui one column stackable center aligned page grid">
         <div className="column twelve wide">
         <div className="ui fluid white card" >
         <div className="height">
          <h1>here</h1>
        <h1 />
        <h1 />
        <Dimmer active inverted>
        <Loader>Analyzing data...</Loader>
        </Dimmer>
        </div>
        </div>
        </div>
        </div>
        </div>
        )
      } else {
      return (
            <div>
        <h1 />
        <div className="ui one column stackable center aligned page grid">
         <div className="column twelve wide">
         <div className="ui fluid white card" >
         <div className="height">
                 <h1 />
        <h1 />
        <h1 />
        <Label color="blue"><h2>Bank account submitted</h2></Label>
        </div>
        </div>
        </div>
        </div>
        </div>
        )
  }
}
}
}

export default connect(mapStateToProps, mapDispatchToProps)(Plaid)


