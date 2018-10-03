import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button, Checkbox, Label, Card, Container} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {Doughnut} from 'react-chartjs-2';
import {getTransactionsByUser} from '../store/plaid'

class BudgetDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      month: new Date(1538148363450)
    }
  }

  componentDidMount() {
    const userId = this.props.user.id
    this.props.getTransactionsByUser(userId)
  }

  render(){

    const transactions = this.props.transactions.transactions
    let donutData;
    let showDonut = false;
    console.log(transactions)

    if (transactions.length > 0) {
      console.log('here', this.state.month)
      donutData = parseTransData(transactions, this.state.month)
      showDonut = true;
      console.log(donutData, showDonut)
    }

  return(
    <div>
    <h1>test</h1>

    { showDonut &&
    <Doughnut data={
      {labels: donutData.labels,
      datasets: [{
        data: donutData.data,
        backgroundColor: donutData.colors
        }]
      }}
    height='50%'

    />

    }
    </div>

  )
  }
}



const mapDispatchToProps = dispatch => {
  return {
    getTransactionsByUser: (userId) => dispatch(getTransactionsByUser(userId))
  }
}

const mapState = state => {
  return {
    user: state.user,
    email: state.user.email,
    transactions: state.transactions
  }
}
export default connect(mapState, mapDispatchToProps)(BudgetDetail)



function parseTransData(transArray, monthDateObj) {
  let yy = monthDateObj.getFullYear()
  let mm = ("0" + Number(Number(monthDateObj.getMonth())+1)).slice(-2)
  let yymm = yy + '-' + mm
  let totals = {}

  console.log(yymm)
  for (let i=0; i<transArray.length; i++) {
    console.log('length', transArray.length)
    console.log('transArray[i]', transArray[i])

    if (transArray[i].date.slice(0,7) !== yymm) {
      console.log('broken')
    } else if (!totals[transArray[i].category.name]) {
      console.log('adding new prop')
      totals[transArray[i].category.name] = Number(transArray[i].amount)
    } else {
      console.log('updating property')
      totals[transArray[i].category.name] += Number(transArray[i].amount)
    }
  }

  console.log("totals", totals)

  return objToDonutObjArray(totals)

}

function objToDonutObjArray(transObj) {
  let donutObj= {
    data: [],
    labels: [],
    colors: []
  }
  let colorArray = ['#DF4B26', '#14D4E4', '#DB14E4', '#F7DC6F', '#F14FA7', '#4F79F1', '#EF9007', '#27D9A6']
  for (let key in transObj) {
    if (key !== "Payment" && key !== "Transfer") {
    if (transObj.hasOwnProperty(key)) {
      donutObj.data.push(transObj[key])
      donutObj.labels.push(key)
      donutObj.colors.push(colorArray[donutObj.labels.length-1 % colorArray.length])
    }
  }
}
return donutObj
}

