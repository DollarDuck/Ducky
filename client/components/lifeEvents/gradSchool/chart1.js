
import React, {Component} from 'react'
import {commaFormat, dataProcessor} from '../../../../utils'
import {Message, Divider} from 'semantic-ui-react'
import {Bar} from 'react-chartjs-2';

const year = (new Date()).getFullYear()

class Chart1 extends Component {

  render() {
    const chartData = dataProcessor(this.props.data)
    const maxIncome = (chartData.breakeven) ? Math.max(chartData.dataCs[chartData.breakeven-1], chartData.dataEs[chartData.breakeven-1]) : 0
    const beArray = (chartData.breakeven) ? getBeArray(chartData.breakeven, maxIncome) : []

    return (
      <div>
              {chartData.breakeven && <Message color="violet"> After spending {commaFormat(((chartData.tuition*chartData.yearsOfSchool)))} on tuition, you will make back your grad school investment in {chartData.breakeven+year}. You'll be {chartData.age + chartData.breakeven} years old. This DOESN'T account for any student loan interest rates.
        </Message>}
        <Divider hidden />
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
          },
          {label: 'Breakeven Year',
           backgroundColor: 'red',
           data: beArray.values,
           type: 'line',
           pointRadius: beArray.radii,
           pointStyle: 'circle',
           pointBackgroundColor: 'red',
           showLine: false,
           pointHoverRadius: beArray.radii,
           pointHoverBackgroundColor: 'pink'

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
    fontSize: 22,
    fontFamily: 'K2D'
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
        if (tooltipItem.datasetIndex === 2) {
          return 'Year '+(year+1+tooltipItem.index)
        }
        return 'Year '+(year+1+tooltipItem.index) + ' salary (' + data.datasets[tooltipItem.datasetIndex].label+')'

      },
      label: function(tooltipItem, data) {
        if (tooltipItem.datasetIndex === 2) {
          return 'breakeven point'
        }
        let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
        return commaFormat(100*Math.round(value/100))
      },
    },
    bodyFontSize: 14
  }
}

function getBeArray(num, maxInc) {
  let radii = []
  for (let i=1; i < num; i++) {
    radii.push(0)
  }
  let values = radii.slice()
  values.push(1.2*maxInc)
  radii.push(10)
  let  beObj = {
    values,
    radii
  }

  return beObj
}
