import React from 'react'
import {connect} from 'react-redux'
import {getBudgetFromServer} from '../store/budget'
import {getSpending} from '../store/spending'
import {
  Menu,
  Header,
  Grid,
  Button,
  Container,
  Divider,
  Icon,
  Image,
  Statistic,
  Table
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {Doughnut, HorizontalBar} from 'react-chartjs-2'
import dateFns from 'date-fns'
import {getCategoryName, commaFormat, getDaysRemaining} from '../../utils'
import EditBudget from './editBudget'

class Budget extends React.Component {
  state = {
    date: new Date()
  }

  nextMonth = async () => {
    this.setState({
      date: dateFns.addMonths(this.state.date, 1)
    })
    await this.props.getBudget(Number(this.props.match.params.userId))
    const currentMonth = this.state.date.getMonth() + 1
    const currentYear = this.state.date.getFullYear()
    const budgetItems = this.props.budget[0].budgetItems
    this.props.getSpending(
      Number(this.props.match.params.userId),
      currentMonth,
      currentYear,
      budgetItems
    )
  }

  prevMonth = async () => {
    this.setState({
      date: dateFns.subMonths(this.state.date, 1)
    })
    await this.props.getBudget(Number(this.props.match.params.userId))
    const currentMonth = this.state.date.getMonth() + 1
    const currentYear = this.state.date.getFullYear()
    const budgetItems = this.props.budget[0].budgetItems
    this.props.getSpending(
      Number(this.props.match.params.userId),
      currentMonth,
      currentYear,
      budgetItems
    )
  }

  async componentDidMount() {
    await this.props.getBudget(Number(this.props.match.params.userId))
    const currentMonth = this.state.date.getMonth() + 1
    const currentYear = this.state.date.getFullYear()
    const budgetItems = this.props.budget[0].budgetItems
    this.props.getSpending(
      Number(this.props.match.params.userId),
      currentMonth,
      currentYear,
      budgetItems
    )
  }

  formatBarData = budget => {
    const labels = []
    const amountData = []
    budget.budgetItems.map(budgetItem => {
      if (budgetItem.categoryId !== 2 && budgetItem.categoryId !== 5) {
        labels.push(getCategoryName(budgetItem.categoryId))
        amountData.push(budgetItem.amount)
      }
    })
    const spendingData = this.props.spending
    return [labels, amountData, spendingData]
  }

  render() {
    const dateFormat = 'MMMM YYYY'
    if (this.props.budget[0] && this.props.spending[0]) {
      const budget = this.props.budget[0]
      console.log('budget', budget)
      const [labels, amountData, spendingData] = this.formatBarData(budget)

      const donutData = getDonutData2(amountData, spendingData, labels)
      console.log('after func')
      console.log(donutData)

      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Month to Date Spending',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: spendingData
          },
          {
            label: 'Budget',
            backgroundColor: 'rgb(204, 196, 223, 0.2)',
            borderColor: 'rgb(204, 196, 223,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgb(204, 196, 223,0.4)',
            hoverBorderColor: 'rgb(204, 196, 223,1)',
            data: amountData
          }
        ]
      }

      return (
        <div>
          <Container>
            <Divider hidden />
            <Header size="huge" textAlign="center">
              Budget
              <Image src="/duck.svg" size="medium" className="padded" />
            </Header>
            <Divider />
            <Divider hidden />
            <Grid centered>
              <h3>
                {' '}
                On this page, you can see your monthly budget, broken down by
                category, as well as your month to date spending calculated from
                your recent bank transactions.
              </h3>
              <h3 />
            </Grid>
            <Link to="/me">
              <Button size="large" floated="left">
                Back to Home
              </Button>
            </Link>
            <h3 />
            <Divider hidden />
            <Divider hidden />
            <div className="header row flex-middle">
              <div className="col col-start" onClick={this.prevMonth}>
                <Icon name="chevron left" />
              </div>
              <div className="col col-center">
                <Header>{dateFns.format(this.state.date, dateFormat)}</Header>
              </div>
              <div className="col col-end" onClick={this.nextMonth}>
                <Icon name="chevron right" />
              </div>
            </div>
            <Divider hidden />
            <div>
              <Doughnut
                data={donutData.data}
                options={donutData.options}
                height={80}
              />
              {this.state.date.getMonth() === new Date().getMonth() ?
              <div>
              <Statistic>
                <Statistic.Value>
                  {Math.abs(Math.round(donutData.daysAOB))}
                </Statistic.Value>
                <Statistic.Label>
                  Day(s) {donutData.daysAOB >= 0 ? ' ahead ' : ' behind '}{' '}
                  schedule
                </Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value>
                  ${Math.round(donutData.dailyIdeal)}
                </Statistic.Value>
                <Statistic.Label>Budgeted Disc. Spend Per Day</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value>
                  ${Math.round(
                    Math.abs(donutData.dailyIdeal * donutData.daysAOB)
                  )}
                </Statistic.Value>
                <Statistic.Label>
                  Total Amount {donutData.daysAOB >= 0 ? ' under ' : ' over '}{' '}
                  budget
                </Statistic.Label>
              </Statistic>
              </div>
              : null }
            </div>
            <Divider hidden />
            <div>
              <HorizontalBar
                data={data}
                height={450}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        stacked: false
                      }
                    ],
                    xAxes: [
                      {
                        ticks: {
                          callback: function(value, index, values) {
                            return commaFormat(value)
                          }
                        }
                      }
                    ]
                  },
                  tooltips: {
                    callbacks: {
                      label: function(tooltipItem, data) {
                        let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                        return commaFormat(value)
                      }
                    }
                  }
                }}
              />
            </div>
            <Table>
              <Table.Row>
                <Table.Cell>
                  Total Discretionary Spending (month-to-date):{' '}
                </Table.Cell>
                <Table.Cell>
                  ${(Math.round(100 * donutData.discSpendingMTD) / 100).toFixed(
                    2
                  )}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  Total Discretionary Spending for Entire Month:{' '}
                </Table.Cell>
                <Table.Cell>
                  ${(Math.round(100 * donutData.totalDiscBudget) / 100).toFixed(
                    2
                  )}
                </Table.Cell>
              </Table.Row>
            </Table>
          </Container>
          <h1 />
          <Grid centered>
            <h1 />
          </Grid>
          <EditBudget budget={budget} />
        </div>
      )
    } else return <Header>You have no budget data for this month.</Header>
  }
}

const mapState = state => ({
  budget: state.budget,
  spending: state.spending,
  user: state.user
})

const mapDispatch = dispatch => ({
  getBudget: userId => dispatch(getBudgetFromServer(userId)),
  getSpending: (userId, currentMonth, currentYear, budgetItem) =>
    dispatch(getSpending(userId, currentMonth, currentYear, budgetItem))
})

export default connect(mapState, mapDispatch)(Budget)

function getDonutData2(budgetArray, spendingArray, labelArray) {
  let budgetObj = {}
  let spendingObj = {}
  let labelForObj
  let donutLabelArray = []
  let donutDataArray = []
  let donutDataArrayBeforeBudgetRemaining = []

  for (let i = 0; i < budgetArray.length; i++) {
    labelForObj = labelArray[i]
    budgetObj[labelForObj] = Number(budgetArray[i])
    spendingObj[labelForObj] = Number(spendingArray[i])
  }

  donutLabelArray = [
    'Monthly Expenses',
    'Food and Drink',
    'Shops',
    'Travel',
    'Recreation',
    'Other',
    'Savings',
    'Big Purchases',
    'Budget Remaining'
  ]

  donutDataArrayBeforeBudgetRemaining = [
    budgetObj['Monthly Expenses'] || 0,
    spendingObj['Food and Drink'] || 0,
    spendingObj['Shops'] || 0,
    spendingObj['Travel'] || 0,
    spendingObj['Recreation'] || 0,
    spendingObj['Other'] || 0,
    budgetObj['Savings'] || 0,
    budgetObj['Big Purchases'] || 0
  ]

  let sum1 = donutDataArrayBeforeBudgetRemaining.reduce((a, b) => a + b, 0)
  let sum2 = budgetArray.reduce((a, b) => Number(a) + Number(b), 0)

  let budgetRemaining = sum2 - sum1

  donutDataArray = donutDataArrayBeforeBudgetRemaining.slice()
  donutDataArray.push(budgetRemaining)

  console.log(donutLabelArray, donutDataArray)

  const daysLeft = getDaysRemaining()

  let ratio = 1
  if (sum1 > sum2) {
    ratio = Math.max(sum1 / sum2, 1.2)
  }

  const allData = {
    labels: donutLabelArray,
    datasets: [
      {
        data: donutDataArray,
        backgroundColor: [
          '#EFC90B', //monthly expenses
          'rgb(048, 016, 078)',
          'rgb(91, 59, 140)',
          'rgb(118, 093, 160)',
          'rgb(147, 128, 182)',
          'rgb(204, 196, 223)',
          '#376A39', //savings
          '#91CC93', //big purchases
          '#D3D3D3'
        ]
      }
    ]
  }

  const options = {
    title: {
      display: true,
      text: [
        'Budget Remaining: ' +
          commaFormat(Math.round(budgetRemaining)) +
          ' / ' +
          commaFormat(Math.round(sum2)),
        'Days Remaining in Month: ' + daysLeft.daysRemaining
      ],
      fontColor: 'black',
      fontSize: 16,
      position: 'bottom'
    },
    rotation: 1 * Math.PI,
    circumference: ratio * Math.PI,
    cutoutPercentage: 30,
    legend: {
      position: 'bottom',
      fontColor: 'black'
    },
    labels: {
      fontSize: 15,
      fontColor: 'black'
    },
    tooltips: {
      callbacks: {
        beforeLabel: function(tooltipItem, data) {
          return data.labels[tooltipItem.index]
        },
        label: function(tooltipItem, data) {
          let value = data.datasets[0].data[tooltipItem.index]
          return commaFormat(Math.round(value * 100) / 100)
        }
      }
    }
  }
  let totalDiscBudget =
    sum2 - donutDataArray[0] - donutDataArray[6] - donutDataArray[7]
  let totalDiscBudgetPerDay = totalDiscBudget / daysLeft.lastDayOfMonth
  let discSpendingMTD =
    donutDataArray[1] +
    donutDataArray[2] +
    donutDataArray[3] +
    donutDataArray[4] +
    donutDataArray[5]
  let onTrackMTD = daysLeft.today * totalDiscBudgetPerDay
  let AOB = onTrackMTD - discSpendingMTD
  let daysAOB = AOB / totalDiscBudgetPerDay

  let returnObj = {
    data: allData,
    options: options,
    dailyIdeal: totalDiscBudgetPerDay,
    daysAOB: daysAOB,
    AOB: AOB,
    discSpendingMTD: discSpendingMTD,
    totalDiscBudget: totalDiscBudget
  }

  return returnObj
}
