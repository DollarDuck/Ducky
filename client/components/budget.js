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
import {getCategoryName, commaFormat, getDaysRemaining, ensureTwoDecimals} from '../../utils'
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
    const budgetItems = this.props.budget[0].budgetItems.sort()
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
    const budgetItems = this.props.budget[0].budgetItems.sort((a, b) => {return (a.categoryId - b.categoryId)})
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
    const budgetItems = budget.budgetItems.sort((a, b) => {return (a.categoryId - b.categoryId)})
    budgetItems.map(budgetItem => {
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
      const [labels, amountData, spendingData] = this.formatBarData(budget)

      const donutData = getDonutData2(amountData, spendingData, labels, this.state.date)

      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Month to Date Spending',
            backgroundColor: 'rgba(255,99,132,0.7)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.7)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: spendingData
          },
          {
            label: 'Budget',
            backgroundColor: 'rgb(204, 196, 223, 0.7)',
            borderColor: 'rgb(204, 196, 223,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgb(204, 196, 223,0.7)',
            hoverBorderColor: 'rgb(204, 196, 223,1)',
            data: amountData
          }
        ]
      }

      return (
        <div>
          <Container>
            <Divider hidden />
            <div className="font-header">
            <Header size="huge" textAlign="center">
              Budget
              <Image src="/duck.svg" size="medium" className="padded" />
            </Header>
            </div>
            <Divider />
            <Divider hidden />
            <Grid centered>
              <h3 className="font-body">
                {' '}
                On this page, you can see your monthly budget, broken down by
                category, as well as your month to date spending calculated from
                your recent bank transactions.
              </h3>
              <h3 />
            </Grid>
            <h3 />
            <Divider hidden />
            <Divider hidden />
            <div className="header row flex-middle">
              <div className="col col-start" onClick={this.prevMonth}>
                <Icon name="chevron left" />
                Previous Month
              </div>
              <div className="col col-center">
                <Header>{dateFns.format(this.state.date, dateFormat)}</Header>
              </div>
              <div className="col col-end" onClick={this.nextMonth}>
                Next Month
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
              <Grid centered>
              <h3 />
              <Statistic>
                <Statistic.Value>
                  {Math.abs(Math.round(donutData.daysAOB))}
                </Statistic.Value>
                <div className="padding-left">
                <Statistic.Label>
                  Day(s) {donutData.daysAOB >= 0 ? ' ahead ' : ' behind '}{' '}
                  schedule
                </Statistic.Label>
                </div>
              </Statistic>
              <h3 />
              <Statistic>
                <Statistic.Value>
                  ${Math.round(donutData.dailyIdeal)}
                </Statistic.Value>
                <div className="padding-left">
                <Statistic.Label>Budgeted Disc. Spend Per Day</Statistic.Label>
                </div>
              </Statistic>
              <h3 />
              <Statistic>
                <Statistic.Value>
                  {commaFormat(Math.round(
                    Math.abs(donutData.dailyIdeal * donutData.daysAOB)
                  ))}
                </Statistic.Value>
                <div className="padding-left">
                <Statistic.Label>
                  Total Amount {donutData.daysAOB >= 0 ? ' under ' : ' over '}{' '}
                  budget
                </Statistic.Label>
                </div>
              </Statistic>
              </Grid>
               <Table color="purple">
              <Table.Row>
                <Table.Cell>
                  Total Discretionary Spending (month-to-date):{' '}
                </Table.Cell>
                <Table.Cell>
                  {commaFormat((Math.round(100 * donutData.discSpendingMTD) / 100).toFixed(
                    2
                  ))}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  Total Discretionary Spending for Entire Month:{' '}
                </Table.Cell>
                <Table.Cell>
                  {commaFormat((Math.round(100 * donutData.totalDiscBudget) / 100).toFixed(
                    2
                  ))}
                </Table.Cell>
              </Table.Row>
            </Table>
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
                        return ensureTwoDecimals(commaFormat(value))
                      }
                    },
                    bodyFontSize: 18
                  }
                }}
              />
            </div>
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

function getDonutData2(budgetArray, spendingArray, labelArray, date2) {
  let budgetObj = {}
  let spendingObj = {}
  let labelForObj
  let donutLabelArray = []
  let donutDataArray = []
  let donutDataArrayBeforeBudgetRemaining = []
  let month = date2.getMonth()

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
          'rgba(048, 016, 078, 0.7)',
          'rgba(91, 59, 140, 0.7)',
          'rgba(118, 093, 160, 0.7)',
          'rgba(147, 128, 182, 0.7)',
          'rgba(204, 196, 223, 0,7)',
          '#376A39', //savings
          '#91CC93', //big purchases
          '#D3D3D3'
        ]
      }
    ]
  }

 const bottomTitle = (month === new Date().getMonth()) ? ([
    'Budget Remaining: ' +
      commaFormat(Math.round(budgetRemaining)) +
      ' / ' +
      commaFormat(Math.round(sum2)),
    'Days Remaining in Month: ' + daysLeft.daysRemaining
  ]) : 'Total Monthly Budget: '+commaFormat(Math.round(sum2))

  const options = {
    title: {
      display: true,
      text: bottomTitle,
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
          return commaFormat(Math.round(value))
        }
      },
      bodyFontSize: 18
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
