import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Header, Icon, Divider } from 'semantic-ui-react'
import { Doughnut } from 'react-chartjs-2'
import dateFns from 'date-fns'
import { getTransactionsByUser } from '../store/plaid'
import {ensureTwoDecimals, commaFormat} from '../../utils'


class SpendingDoughnut extends Component {
  state = {
      date: new Date(),
      donutData: {data: []}
    }

  async componentDidMount() {
    const userId = this.props.user.id
    await this.props.getTransactionsByUser(userId)
    const transactions = this.props.transactions.transactions
    this.setState({donutData : parseTransactionData(transactions, this.state.date)})
  }

  nextMonth = () => {
    const currentMonth = this.state.date.getMonth()
    const date = this.state.date
    date.setMonth(currentMonth+1)
    this.setState({
      date: date
    })
    const transactions = this.props.transactions.transactions
    this.setState({donutData : parseTransactionData(transactions, this.state.date)})
  }

  prevMonth = () => {
    const currentMonth = this.state.date.getMonth()
    const date = this.state.date
    date.setMonth(currentMonth - 1)
    this.setState({
      date: date
    })
    const transactions = this.props.transactions.transactions
    this.setState({donutData : parseTransactionData(transactions, this.state.date)})
  }

  render() {
    const dateFormat = 'MMMM YYYY'
    const donutData = this.state.donutData

    return (
      <Container>
        <Divider hidden />
        <div className="header row flex-middle">
        <Divider hidden />
        <br />
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

        {!donutData.data.length
        ? <Header>You have no spending history for this month.</Header>
        : <Doughnut
        data={{
          labels: donutData.labels,
          datasets: [
            {
              data: donutData.data,
              backgroundColor: donutData.colors
            }
          ]
        }}
        options={{
          tooltips: {
            callbacks: {
            beforeLabel: function(tooltipItem, data) {
              return data.labels[tooltipItem.index]
            },
            label: function(tooltipItem, data) {
              let value = data.datasets[0].data[tooltipItem.index]
              return ' '+ensureTwoDecimals(commaFormat(Math.round(value * 100) / 100))
            }
          },
          bodyFontSize: 22
        }}

        }

      />}
      </Container>
    )
  }
}


const mapState = state => {
  return {
    user: state.user,
    email: state.user.email,
    transactions: state.transactions
  }
}

const mapDispatch = dispatch => {
  return {
    getTransactionsByUser: userId => dispatch(getTransactionsByUser(userId))
  }
}

export default connect(mapState, mapDispatch)(SpendingDoughnut)

function parseTransactionData(transArray, currentDate) {
  let yy = currentDate.getFullYear()
  let mm = ('0' + Number(Number(currentDate.getMonth()) + 1)).slice(-2)
  let yymm = yy + '-' + mm
  let totals = {}
  for (let i = 0; i < transArray.length; i++) {

    if (transArray[i].date.slice(0, 7) !== yymm) {
      continue
    } else if (!totals[transArray[i].category.name]) {
      totals[transArray[i].category.name] = Number(transArray[i].amount)
    } else {
      totals[transArray[i].category.name] += Number(transArray[i].amount)
    }
  }
  return formatDonutData(totals)
}

function formatDonutData(totalsObj) {
  let donutObj = {
    data: [],
    labels: [],
    colors: []
  }
  let colorArray = [
    '#99EF0B',
    '#EF380B',
    '#57F9E5',
    '#F7DC6F',
    '#F14FA7',
    '#4F79F1',
    '#EF9007',
    '#27D9A6'
  ]
  for (let key in totalsObj) {
    if (key !== 'Payment' && key !== 'Transfer') {
      if (totalsObj.hasOwnProperty(key)) {
        donutObj.data.push(totalsObj[key].toFixed(2))
        donutObj.labels.push(key)
        donutObj.colors.push(
          colorArray[donutObj.labels.length - 1 % colorArray.length]
        )
      }
    }
  }
  return donutObj
}
