import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button, Checkbox, Label} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {Bar} from 'react-chartjs-2';
import {getDBBalances} from '../store/balances'

class Balances extends Component {

  componentDidMount() {
    const userId = this.props.user.id
    this.props.getDBBalances(userId)
  }


  render() {
    const balances = this.props.balances || false
    console.log(balances)
    let chartData
    let showBarChart = false
    if (balances.length > 0) {
      chartData = processBalances(balances)
      showBarChart = true
      console.log("x", chartData.depository.data)
    }
    console.log(balances)

    return (
      <div>
      <h1> balances </h1>

      { (showBarChart) &&
      <h2> Checking and Savings </h2> &&
      <Bar
        data = {{
          labels: chartData.depository.labels,
          datasets: [{
            label: 'All Depository Data',
            data: chartData.depository.data,
          }],
          backgroundColor: ['#52E577']
        }}
        height='50%'
      />


      }
      </div>
    )}
}

const mapDispatchToProps = dispatch => {
  return {
    getDBBalances: (userId) => dispatch(getDBBalances(userId))
  }
}

const mapState = state => {
  return {
    user: state.user,
    email: state.user.email,
    balances: state.balances
  }
}

export default connect(mapState, mapDispatchToProps)(Balances)


function processBalances(balancesArray) {
  let depository = {}
  let credit = {}
  depository.labels = []
  depository.data = []
  credit.labels = []
  credit.data =[]
  for (let i=0; i<balancesArray.length; i++) {
    if (balancesArray[i].type === "depository") {
      depository.data.push(Number(balancesArray[i].amount))
      depository.labels.push(balancesArray[i].name)
    } else if (balancesArray[i].type === "credit") {
      credit.data.push(Number(balancesArray[i].amount))
      credit.labels.push(balancesArray[i].name)
      }
  }
  let returnObj = {}
  returnObj.depository = depository
  returnObj.credit = credit
  return returnObj
}
