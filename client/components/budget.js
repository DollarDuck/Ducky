import React from 'react'
import {connect} from 'react-redux'
import {getBudgetFromServer} from '../store/budget'
import {Menu, Header, Button, Container, Divider, Icon, Image} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {Bar, HorizontalBar} from 'react-chartjs-2'
import dateFns from 'date-fns'
import {getCategoryName} from '../../utils'

class Budget extends React.Component {
  state = {
    date: new Date()
  }

  nextMonth = () => {
    this.setState({
      date: dateFns.addMonths(this.state.date, 1)
    })
  }

  prevMonth = () => {
    this.setState({
      date: dateFns.subMonths(this.state.date, 1)
    })
  }

  componentDidMount() {
    this.props.getBudget(Number(this.props.match.params.userId))
  }

  formatBarData = budget => {
    const labels = []
    const amountData = []
    const spendingData = []

    budget.budgetItems.map(budgetItem => {
      labels.push(getCategoryName(budgetItem.categoryId))
      amountData.push(budgetItem.amount)
      spendingData.push(budgetItem.mtdSpending)
    })
    return [labels, amountData, spendingData]
  }

  render() {
    const dateFormat = 'MMMM YYYY'
    if (this.props.budget[0]) {
      const budget = this.props.budget[0]
      console.log('budget!', budget)
      const [labels, amountData, spendingData] = this.formatBarData(budget)
      const totalSpending = spendingData.reduce(
        (total, currentVal) => Number(total) + Number(currentVal)
      )

      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Budget limit',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: amountData
          },
          {
            label: 'Month to date spending',
            backgroundColor: 'rgb(151, 198, 239,0.2)',
            borderColor: 'rgb(151, 198, 239,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgb(151, 198, 239,0.4)',
            hoverBorderColor: 'rgb(151, 198, 239,1)',
            data: spendingData
          }
        ]
      }

      const totalData = {
        labels: ['Total Budget'],
        datasets: [
          {
            label: 'Budget limit',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [budget.amount]
          },
          {
            label: 'Month to date spending',
            backgroundColor: 'rgb(151, 198, 239,0.2)',
            borderColor: 'rgb(151, 198, 239,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgb(151, 198, 239,0.4)',
            hoverBorderColor: 'rgb(151, 198, 239,1)',
            data: [totalSpending]
          }
        ]
      }

      return (
        <Container>
          <Divider hidden />
          <Header size="huge" textAlign="center">
            Budget
            <Image src="/duck.svg" size="medium" className="padded" />
          </Header>
          <Divider />
          <Divider hidden />
          <Button
            as={Link}
            to={`/editBudget/${budget.id}`}
            circular
            floated="right"
            icon="edit"
          />
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
      )
    } else return <Header>You have no budget data for this month.</Header>
  }
}

const mapState = state => ({
  budget: state.budget,
  user: state.user
})

const mapDispatch = dispatch => ({
  getBudget: userId => dispatch(getBudgetFromServer(userId))
})

export default connect(mapState, mapDispatch)(Budget)
