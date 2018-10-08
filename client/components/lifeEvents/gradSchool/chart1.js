
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {commaFormat, dataProcessor, convertIncome} from '../../../../utils'
import {Message, Label, Button, Icon} from 'semantic-ui-react'
import {Bar} from 'react-chartjs-2';

const year = (new Date()).getFullYear()

class Chart1 extends Component {

  render() {
    const chartData = dataProcessor(this.props.data)
    console.log(chartData)

    return (
      <div>
              {chartData.breakeven && <Message color="blue"> After spending {commaFormat(((chartData.tuition*chartData.yearsOfSchool)))} on tuition, you will make back your grad school investment in {chartData.breakeven+year}. You'll be {chartData.age + chartData.breakeven} years old. This DOESN'T account for any student loan interest rates.
        </Message>}
        {!chartData.breakeven && <Message color="red"> Doesn't look like a great investment for you. You don't recoup your investment even when we exclude the time value of money.</Message>}
        <Bar
        data = {{
          labels: chartData.years,
          datasets: [{
            backgroundColor: 'green',
            label: 'Current Salary',
            data: chartData.dataCs
          },
          {
            backgroundColor: '#4E8BED',
            label: 'With Grad School',
            data: chartData.dataEs
          }],
        }}
        options= {options}
        height='50%'
        />
        <br />
</div>
    )
  }
}
export default Chart1

const options = {
  title: {
    display: true,
    text: 'Your salary projection until retirement age',
    fontColor: 'black',
    fontSize: 20
  },
  scales: {
    xAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Age (years)'
      },
      ticks: {
        fontColor: 'black',
      },
      stacked: false
    }],
    yAxes: [{
      ticks: {
        callback: function(value, index, values) {
          return commaFormat(value)
        },
        fontColor: 'black',
        beginAtZero: true,
        fontSize: 15
      },
      stacked: false
    }]
  },
  tooltips: {
    callbacks: {
      title: function(){
        return ''
      },
      beforeLabel: function(tooltipItem, data) {
        return 'Year '+(year+1+tooltipItem.index) + ' salary (' + data.datasets[tooltipItem.datasetIndex].label+')'
      },
      label: function(tooltipItem, data) {
        console.log(tooltipItem)
        let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
        console.log(data)
        console.log(value)
        return commaFormat(100*Math.round(value/100))
      },
    },
    bodyFontSize: 14
  }
}
