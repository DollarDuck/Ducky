
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {commaFormat, dataProcessor} from '../../../../utils'
import {Message, Header, Statistic, Container, Image, Item} from 'semantic-ui-react'
import {Line} from 'react-chartjs-2';

const year = (new Date()).getFullYear()

class Chart2 extends Component {

  render() {
    console.log(this.props.data)

    const chartData = dataProcessor(this.props.data)
    const headerMessage = headerMessageFunc(chartData.breakevenNPV)
    const outputMessage = messageToDisplay(chartData.breakevenNPV, this.props.data.age)
    console.log('chart data', chartData)

    return (
      <div>
        <Message color={headerMessage.color} >
      <Item.Group>
      <Item color={headerMessage.color} >
      <Item.Image src="/clipartduck1.png" size="small" />
      <Item.Content verticalAlign='middle'>
      <Item.Header as='a'>
        {headerMessage.header}
      </Item.Header>
      <p> - Professor Ducky </p>
      </Item.Content>
      </Item>
      </Item.Group>
      </Message>
      <br />

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
      <Message> Cumulative net present value represents the value of your stream of future income </Message>
      {chartData.breakevenNPV && <Message>You will recoup your investment in {chartData.breakevenNPV} years ({year+chartData.breakevenNPV}). {outputMessage} </Message> }
      {!chartData.breakevenNPV && <Message>Even until your retirement age, grad school does not make sense financially based on the inputs your have provided Professor Ducky</Message>}
      <Header as='h3'>Chart based on a discount rate of {this.props.data.discountRate} % </Header>
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
        console.log(data)
        console.log(value)
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

function headerMessageFunc(years) {
  let returnObj = {}
  if (years < 8 && years > 0) {
    returnObj.color = 'green'
    returnObj.header = 'Dear Little Duckling: Grad school is a wise investment for you!'
  } else if (years<12 && years>0) {
    returnObj.color='olive'
    returnObj.header = 'Grad school will take around a decade to pay off but could be a wise choice'
  }
    else if (years < 18 && years > 0) {
    returnObj.color = 'blue'
    returnObj.header = 'Grad school will take time to make sense financially but the logic is there'
  } else if (years >= 18 || !years ) {
    returnObj.color = 'red'
    returnObj.header = 'Grad school tuition is not a good idea for your wallet!'
  } else {
    returnObj.color = 'violet'
    returnObj.header = 'I am Professor Ducky!'
  }
  return returnObj
}
