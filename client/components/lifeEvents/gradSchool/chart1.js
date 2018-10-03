
import React, {Component} from 'react'
import {connect} from 'react-redux'

import {Bar} from 'react-chartjs-2';

class Chart1 extends Component {

  render() {

    const data = this.props.data
    const chartData = dataProcessor(data)
    console.log(chartData)
    console.log(data)

    return (
      <div>
        <p>
        currentSalary: 0,
        csGrowth: 3,
        expectedSalary: 0,
        esGrowth: 3,
        yearsOfSchool: 3,
        retirementAge: 65,
        age: 25,
        tuition: 0,
        livingExpenses: 0,
        discountRate: 5,
        </p>


        <Bar

        data = {{
          labels: chartData.years,
          datasets: [{
            label: 'Current Salary',
            data: chartData.dataCs
          },
          {
            label: 'Expected Salary',
            data: chartData.dataEs
          }],
          backgroundColor: ['green', 'blue']
        }}
        />




</div>

    )


  }
}


export default Chart1


function dataProcessor(dataObj) {
  let currentSalary = Number(dataObj.currentSalary)
  let csGrowth = Number(dataObj.csGrowth)
  let expectedSalary = Number(dataObj.expectedSalary)
  let esGrowth = Number(dataObj.esGrowth)
  let yearsOfSchool = Number(dataObj.yearsOfSchool)
  let retirementAge = Number(dataObj.retirementAge)
  let age = Number(dataObj.age)
  let tuition = Number(dataObj.tuition)
  let livingExpenses = Number(dataObj.livingExpenses)
  let discountRate = Number(dataObj.discountRate)
  let currentSalaryArray = [];
  let expectedSalaryArray = [];
  let yearArray = [];
  let i=1;
  let workingYears = retirementAge - age
  let salary
  let returnObj = {}


  while (i < workingYears) {

    yearArray.push(i)

    salary = currentSalary * Math.pow((1+csGrowth / 100), i)
    currentSalaryArray.push(Math.round(salary))

    if(i <= yearsOfSchool) {
      expectedSalaryArray.push(0)
    } else {
      salary = expectedSalary * Math.pow((1+esGrowth / 100), i-yearsOfSchool)
      expectedSalaryArray.push(Math.round(salary))
    }
    i += 1

  }

  returnObj.dataCs = currentSalaryArray
  returnObj.dataEs = expectedSalaryArray
  returnObj.years = yearArray

  return returnObj




}
