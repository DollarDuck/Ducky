
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {commaFormat, dataProcessor} from '../../../../utils'
import {Grid, Form, Message, Header, Statistic, Container, Image, Item} from 'semantic-ui-react'
import {Line} from 'react-chartjs-2';

const year = (new Date()).getFullYear()

class Chart2 extends Component {
  state = {
    discountRate: 6
  }
  updateRate = (event) => {
    this.setState({ discountRate: event.target.value})
  }
  render() {
    console.log(this.props.data)
    const chartData = dataProcessor(this.props.data)
    const outputMessage = messageToDisplay(chartData.breakevenNPV, this.props.data.age)
    return (
      <div>
      <Line
        data = {{
          labels: chartData.years,
          datasets: [{
            backgroundColor: 'green',
            label: 'Cumulaitve Net Present Value (NPV) Without Grad School',
            data: chartData.currentSalaryNPVCum,
            fill: false
          },{
            backgroundColor: 'blue',
            label: 'Cumulaitve Net Present Value (NPV) With Grad School',
            data: chartData.expectedSalaryNPVCum,
            fill: false
          }
        ]
        }}
        options={options}
        height='70%'
      />

        <Container fluid centered>
       <Statistic size='small' className="padding-left">
       <Statistic.Value> {commaFormat(chartData.currentSalaryNPVCum[chartData.currentSalaryNPVCum.length-1])} </Statistic.Value>
       <Statistic.Label>NPV Without Grad School </Statistic.Label>
     </Statistic>
     <Statistic size='small' className="padding-left">
       <Statistic.Value> {commaFormat(chartData.expectedSalaryNPVCum[chartData.expectedSalaryNPVCum.length-1])} </Statistic.Value>
       <Statistic.Label>NPV of Grad School Track </Statistic.Label>
     </Statistic>
     </Container>
      <Message className="padding-left"> Cumulative net present value represents the value of your stream of future income </Message>
      {chartData.breakevenNPV && <Message className="padding-left">You will recoup your investment in {chartData.breakevenNPV} years ({year+chartData.breakevenNPV}). {outputMessage} </Message> }
      {!chartData.breakevenNPV && <Message className="padding-left">Even until your retirement age, grad school does not make sense financially based on the inputs your have provided Professor Ducky</Message>}
      </div>
    )
  }
}


export default Chart2

const options = {
  title: {
    display: true,
    text: 'Cumulative Net Present Value',
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
      }
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
        return 'Year '+(year+1+tooltipItem.index) + ' (' + data.datasets[tooltipItem.datasetIndex].label+')'
      },
      label: function(tooltipItem, data) {
        console.log(tooltipItem)
        let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
        return commaFormat(100*Math.round(value/100))
      },
    },
    bodyFontSize: 14
  }
}


function messageToDisplay(years, age) {
  let message = ''
  if (years < 5) {
    message = 'Based on our math, it looks like going to grad school is a really good investment.'
  } else if (years < 10) {
    message = 'It will take time to recoup your investment, but it looks grad school is a viable path for you'
  } else if (years < 20) {
    message = 'It will take over a decade to recoup your investment but it could still be worth it. Think hard about your decision'
  } else {
    message = 'Based on our calculations, it will take '+years+' for your decision to make sense financially. You will be '+ (years+age)+'!'
  }
  return message
}


