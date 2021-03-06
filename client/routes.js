import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  SplashPage,
  PurchasePlanner,
  Budget,
  EditBudget,
  Login,
  Signup,
  Onboarding,
  OnboardingBudget,
  LinkBank,
  Bills,
  NewBillForm,
  OnboardingLink,
  Balances,
  EditUser,
  UserProfile,
  SpendingMenu,
  GradSchoolInput
} from './components'
import {me} from './store'
import {Sidebar} from 'semantic-ui-react'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
<Sidebar.Pusher dimmed={this.props.visible}>
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" component={Login} />
        <Route exact path="/onboarding" component={Onboarding} />
        <Route path="/onboarding/step2" component={OnboardingBudget} />
        <Route path="/onboarding/step3" component={OnboardingLink} />
        <Route path="/signup" component={Signup} />
        <Route path="/plaid" component={LinkBank} />
        <Route
          path="/lifeEvents/gradSchool/input"
          component={GradSchoolInput}/>

        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route path="/balances" component={Balances} />
            <Route path="/spending/:userId" component={SpendingMenu} />
            <Route path="/userProfile" component={UserProfile} />
            <Route path="/bills/addbill/:userId" component={NewBillForm} />
            <Route path="/bills/:userId" component={Bills} />
            <Route
              path="/purchasePlanner/:userId"
              component={PurchasePlanner}/>
            <Route path="/budget/:userId" component={Budget} />
            <Route path="/editBudget/:budgetId" component={EditBudget} />
            <Route
              path="/purchasePlanner/:userId"
              component={PurchasePlanner}/>
            <Route path="/editUser/:userId" component={EditUser} />
          </Switch>
        )}
        {/* Displays our Login component as a fallback */}
        <Route component={SplashPage} />
      </Switch>
      </Sidebar.Pusher>

    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
