import React, {Component} from 'react'
import PlaidLink from 'react-plaid-link'
import {connect} from 'react-redux'
import {getTransactions, getBalances} from '../store/plaid'
import {updateUser} from '../store/user'
import {get30DaysAgo} from '../../utils'
import {Link} from 'react-router-dom'
import {Dimmer, Loader, Button, Divider, Message} from 'semantic-ui-react'

const mapStateToProps = state => ({
  user: state.user,
  transactions: state.transactions.transactions,
  balances: state.transactions.balances
})

const mapDispatchToProps = dispatch => ({
  getTransactions: (userId, lastUpdateDate, token, institution) =>
    dispatch(getTransactions(userId, lastUpdateDate, token, institution)),
  getBalances: (userId, token, institution) =>
    dispatch(getBalances(userId, token, institution)),
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
    await this.props.getTransactions(
      userId,
      lastUpdateDate,
      token,
      metadata.institution.name
    )
    await this.props.getBalances(userId, token, metadata.institution.name)
    await this.props.updateUser(userId)
    this.setState({accountLinked: true})
  }
  render() {
    if (!this.state.startLoading) {
      return (
        <div className="height">
          <Divider hidden />
          <Divider hidden />
          <Divider hidden />
          <PlaidLink
            clientName="Dollar Ducky"
            env="sandbox"
            product={['auth', 'transactions']}
            publicKey="2e86ad2a3b3a35d15f0112504ac7d3"
            apiVersion="v2"
            onSuccess={this.handleOnSuccess}
          >
            <Button size="massive">Link your bank account</Button>
          </PlaidLink>
          <h3 />
          {this.props.isOnboarding ? (
              <Button as={Link} to={`/budget/${this.props.user.id}`}>Skip this step</Button>
          ) : (
            ''
          )}
        </div>
      )
    } else {
      return (
        <div className="height">
          {!this.state.accountLinked ? (
            <Dimmer active inverted>
              <Loader>Analyzing data...</Loader>
            </Dimmer>
          ) : (
            <div>
              <Message color="blue">
                <Message.Header>Bank account submitted</Message.Header>
              </Message>
              <Divider hidden />
              <Button as={Link} to={`/budgets/${this.props.user.id}`}>
                See my New Budget
              </Button>
            </div>
          )}
        </div>
      )
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Plaid)
