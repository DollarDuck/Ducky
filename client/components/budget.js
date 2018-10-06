import React from 'react'
import {connect} from 'react-redux'
import {getBudgetFromServer} from '../store/budget'
import {getSpending} from '../store/spending'
import {Menu, Header, Grid, Button, Container, Divider, Icon, Image} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {Bar, HorizontalBar} from 'react-chartjs-2'
import dateFns from 'date-fns'
import {getCategoryName} from '../../utils'
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
    this.props.getSpending(Number(this.props.match.params.userId), currentMonth, currentYear, budgetItems)
  }

  prevMonth = async () => {
    this.setState({
      date: dateFns.subMonths(this.state.date, 1)
    })
    await this.props.getBudget(Number(this.props.match.params.userId))
    const currentMonth = this.state.date.getMonth() + 1
    const currentYear = this.state.date.getFullYear()
    const budgetItems = this.props.budget[0].budgetItems
    this.props.getSpending(Number(this.props.match.params.userId), currentMonth, currentYear, budgetItems)
  }

  async componentDidMount() {
    await this.props.getBudget(Number(this.props.match.params.userId))
    const currentMonth = this.state.date.getMonth() + 1
    const currentYear = this.state.date.getFullYear()
    const budgetItems = this.props.budget[0].budgetItems
    this.props.getSpending(Number(this.props.match.params.userId), currentMonth, currentYear, budgetItems)
  }

  formatBarData = budget => {
    const labels = []
    const amountData = []
    budget.budgetItems.map(budgetItem => {
      labels.push(getCategoryName(budgetItem.categoryId))
      amountData.push(budgetItem.amount)
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
      const totalSpending = spendingData.reduce(
        (total, currentVal) => Number(total) + Number(currentVal)
      )

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
            backgroundColor: 'rgb(151, 198, 239,0.2)',
            borderColor: 'rgb(151, 198, 239,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgb(151, 198, 239,0.4)',
            hoverBorderColor: 'rgb(151, 198, 239,1)',
            data: amountData
          }
        ]
      }

      const totalData = {
        labels: ['Total Budget'],
        datasets: [
                  {
            label: 'Month to Date Spending',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [totalSpending]
          },
        {
            label: 'Budget',
            backgroundColor: 'rgb(151, 198, 239,0.2)',
            borderColor: 'rgb(151, 198, 239,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgb(151, 198, 239,0.4)',
            hoverBorderColor: 'rgb(151, 198, 239,1)',
            data: [budget.income]
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
          <h3> On this page, you can see your monthly budget, broken down by category, as well as your month to date spending calculated from your recent bank transactions.</h3>
          <h3 />
          </Grid>
          <Link to="/me"><Button size="large" floated="left">Back to Home</Button></Link>
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
            <HorizontalBar
              data={totalData}
              height={150}
              options={{
                maintainAspectRatio: false,
                scales: {
                  yAxes: [
                    {
                      stacked: true
                    }
                  ]
                }
              }}
            />
          </div>
          <Divider hidden />
          <div>
            <HorizontalBar
              data={data}
              height={300}
              options={{
                maintainAspectRatio: false,
                scales: {
                  yAxes: [
                    {
                      stacked: true
                    }
                  ]
                }
              }}
            />
          </div>
        </Container>
          <h1 />
        <Grid centered>
          <h1 />
        </Grid>
        <EditBudget budget={budget}/>
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
  getSpending:  (userId, currentMonth, currentYear, budgetItem) => dispatch(getSpending(userId, currentMonth, currentYear, budgetItem))
})

export default connect(mapState, mapDispatch)(Budget)
