import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Divider, Container, Header, Grid, Image, Button} from 'semantic-ui-react'
import {Bar} from 'react-chartjs-2'
import {getDBBalances} from '../store/balances'
import {Link} from 'react-router-dom'
import {commaFormat, ensureTwoDecimals} from '../../utils'


class Balances extends Component {
  componentDidMount() {
    const userId = this.props.user.id
    this.props.getDBBalances(userId)
  }

  render() {
    const balances = this.props.balances || false
    let chartData
    if (balances.length > 0) {
      chartData = processBalances(balances)

    return (
      <Container>
        <Divider hidden />
        <Header size="huge" textAlign="center">
          Account Balances
          <Image src="/duck.svg" size="medium" className="padded" />
        </Header>
        <Divider />
        <Divider hidden />
        {balances.length > 0
        ? <Container>
          <Bar
            data = {{
              labels: chartData.depository.labels,
              datasets: [{
                label: 'Available Balance ($US)',
                data: chartData.depository.data,
                backgroundColor: 'green'

              }],
            }}

            options={{
              legend: {display: false},
              title: {
                display: true,
                text: 'Checking, Savings, CD, Money Market Accounts (Total Value: ' + commaFormat(Math.round(chartData.depository.total)) + ')',
                fontColor: 'black',
                fontSize: 20
              },
              scales: {
                yAxes: [{
                  ticks: {
                    callback: function(value, index, values) {
                      return commaFormat(value)
                    },
                    fontColor: 'green',
                    beginAtZero: true
                    }
                }],
              },
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                    let value = data.datasets[0].data[tooltipItem.index];
                    return ensureTwoDecimals(commaFormat(value))
                       },
                  afterLabel: function(tooltipItem, data) {
                    return 'available'
                  }
                  },
                  bodyFontSize: 20
              },
                xAxes: [{
                  ticks: {
                    fontColor: 'orange',
                    fontStyle: 'bold'
                  }
                }]
              }
            }
            height={50}
          />

            <Bar
              data = {{
                labels: chartData.credit.labels,
                datasets: [{
                  label: 'Available Balance ($US)',
                  data: chartData.credit.data,
                  backgroundColor: 'red'

                }],
              }}

              options={{
                legend: {display: false},
                title: {
                  display: true,
                  text: 'Credit Card Balance Data (Total Value: ' + commaFormat(Math.round(chartData.credit.total))+')',
                  fontColor: 'black',
                  fontSize: 20
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      callback: function(value, index, values) {
                      return commaFormat(value)
                      },
                      fontColor: 'red',
                      beginAtZero: true
                      }
                  }],
                },
                  tooltips: {
                    callbacks: {
                      label: function(tooltipItem, data) {
                      let value = data.datasets[0].data[tooltipItem.index];
                    return ensureTwoDecimals(commaFormat(value))
                         },
                    afterLabel: function(tooltipItem, data) {
                      return 'balance'
                    }
                    },
                    bodyFontSize: 20
                },
                  xAxes: [{
                    ticks: {
                      fontColor: 'orange',
                      fontStyle: 'bold'
                    }
                  }]
                }
              }
              height={50}
            />
            </Container>

        : (
          <Grid centered width={7}>
            <h3>
              Currently, you have no linked bank accounts. You'll want to enter
              your user profile to add in a bank account.
            </h3>
          </Grid>
        )}
      </Container>
    )
} else return null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getDBBalances: userId => dispatch(getDBBalances(userId))
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
  console.log(balancesArray)
  let depository = {}
  let credit = {}
  depository.labels = []
  depository.data = []
  depository.total = 0
  credit.labels = []
  credit.data = []
  credit.total = 0
  console.log(credit.total)

  for (let i = 0; i < balancesArray.length; i++) {
    if (balancesArray[i].type === 'depository') {
      depository.data.push(Number(balancesArray[i].amount))
      depository.labels.push(balancesArray[i].name)
      depository.total += Number(balancesArray[i].amount)
      console.log(depository)
    } else if (balancesArray[i].type === 'credit') {
      credit.data.push(Number(balancesArray[i].amount))
      credit.labels.push(balancesArray[i].name)
      credit.total += Number(balancesArray[i].amount)
      console.log(credit)

    }
  }

  let returnObj = {}
  returnObj.depository = depository
  returnObj.credit = credit
  console.log("return obj", returnObj)
  return returnObj
}
