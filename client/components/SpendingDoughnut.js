import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Header, Icon, Divider } from 'semantic-ui-react'
import { Doughnut } from 'react-chartjs-2'
import dateFns from 'date-fns'
import { getTransactionsByUser } from '../store/plaid'

class SpendingDoughnut extends Component {
  state = {
      date: new Date(1538148363450),
    }

  async componentDidMount() {
    const userId = this.props.user.id
    await this.props.getTransactionsByUser(userId)
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

  render() {
    const dateFormat = 'MMMM YYYY'

    const transactions = this.props.transactions.transactions
    let donutData

    if (transactions.length > 0) {
      donutData = parseTransactionData(transactions, this.state.date)
    }

    return (
      <Container>
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
    '#DF4B26',
    '#14D4E4',
    '#DB14E4',
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
