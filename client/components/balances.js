import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Divider, Container, Header, Grid, Image, Button} from 'semantic-ui-react'
import {Bar} from 'react-chartjs-2'
import {getDBBalances} from '../store/balances'
import {Link} from 'react-router-dom'

class Balances extends Component {
  componentDidMount() {
    const userId = this.props.user.id
    this.props.getDBBalances(userId)
  }

  render() {
    const balances = this.props.balances || false
    let chartData
    if (balances.length > 0) {
      console.log('here!', balances)
      chartData = processBalances(balances)
      console.log('chartData', chartData)
    return (
      <Container>
        <Divider hidden />
        <Header size="huge" textAlign="center">
          Account Balances
          <Image src="/duck.svg" size="medium" className="padded" />
        </Header>
        <Divider />
        <Divider hidden />
        <Link to="/me"><Button size="large" floated='left'>Back to Home</Button></Link>
        {balances.length > 0
        ? <Container>
          <Bar
            data = {{
              labels: chartData.depository.labels,
              datasets: [{
                label: 'Available Balance ($US)',
                data: chartData.depository.data,
              }],
              backgroundColor: ['#52E577']
            }}

            options={{
              legend: {display: false},
              title: {
                display: true,
                text: 'Checking, Savings, CD, Money Market Accounts (Total Value: ' + commaFormat(chartData.depository.total) + ')',
                fontColor: 'black',
                fontSize: 20
              },
              scales: {
                yAxes: [{
                  ticks: {
                    callback: function(value, index, values) {
                      if (value>=1000) {
                        let backEnd = '00' + (value-1000*Math.floor(value/1000))
                        let backEnd3digit = backEnd.slice(backEnd.length-3, backEnd.length)
                        return '$' + Math.floor(value/1000) + ',' + backEnd3digit
                      }
                      return '$'+value;
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
                    if (value>=1000) {
                      let backEnd = '00' + (value-1000*Math.floor(value/1000))
                      let backEnd3digit = backEnd.slice(backEnd.length-3, backEnd.length)

                      return '$' + Math.floor(value/1000) + ',' + backEnd3digit
                      }
                    return '$'+value;
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
                }],
                backgroundColor: ['#52E577']
              }}

              options={{
                legend: {display: false},
                title: {
                  display: true,
                  text: 'Credit Card Balance Data (Total Value: ' + commaFormat(chartData.credit.total)+')',
                  fontColor: 'black',
                  fontSize: 20
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      callback: function(value, index, values) {
                        if (value>=1000) {
                          let backEnd = '00' + (value-1000*Math.floor(value/1000))
                          let backEnd3digit = backEnd.slice(backEnd.length-3, backEnd.length)
                          return '$' + Math.floor(value/1000) + ',' + backEnd3digit
                        }
                        return '$'+value;
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
                      if (value>=1000) {
                        let backEnd = '00' + (value-1000*Math.floor(value/1000))
                        let backEnd3digit = backEnd.slice(backEnd.length-3, backEnd.length)

                        return '$' + Math.floor(value/1000) + ',' + backEnd3digit
                        }
                      return '$'+value;
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
  let depository = {}
  let credit = {}
  depository.labels = []
  depository.data = []
  depository.total = 0
  credit.labels = []
  credit.data = []
  credit.total = 0

  for (let i = 0; i < balancesArray.length; i++) {
    if (balancesArray[i].type === 'depository') {
      depository.data.push(Number(balancesArray[i].amount))
      depository.labels.push(balancesArray[i].name)
      depository.total += Number(balancesArray[i].amount)
    } else if (balancesArray[i].type === 'credit') {
      credit.data.push(Number(balancesArray[i].amount))
      credit.labels.push(balancesArray[i].name)
      credit.total += Number(balancesArray[i].amount)
    }
  }
  let returnObj = {}
  returnObj.depository = depository
  returnObj.credit = credit
  return returnObj
}

function commaFormat(value) {
  if (value >= 1000) {
    let backEnd = '00' + (value - 1000 * Math.floor(value / 1000))
    let backEnd3digit = backEnd.slice(backEnd.length - 3, backEnd.length)

    return '$' + Math.floor(value / 1000) + ',' + backEnd3digit
  }
  return '$' + Math.round(value)
}
