const formatDate = (lastUpdateDate) => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1; //January is 0!

  if(dd.toString().length < 2) {
    dd = "0" + dd
  }
  if(mm.toString().length < 2) {
    mm = "0" + mm
  }

  const yyyy = today.getFullYear();
  const endDate = yyyy+ '-' + mm + '-' + dd
  const startDate = lastUpdateDate.slice(0,10)

  return [endDate, startDate]
}

function convertIncome(income) {
  let returnStr = ''
  for(let i=0; i< income.length; ++i) {
    if(income[i] !== ',' && income[i] !== '$') returnStr += income[i]
  }
  return Number(returnStr)
}

function convertPhoneNumber(number) {
  if(number.indexOf('-') > -1) {
    number = number.split('-').join('')
  } else if(number.indexOf('(') > -1) {
    number = number.split('(').join('')
    number = number.split(')').join('')
  }
  return number
}

function getMonthYear(currentTransaction) {
  const month = Number(currentTransaction.date.slice(5,7))
  const year = Number(currentTransaction.date.slice(0,4))
  return [month, year]
}

function get30DaysAgo() {
  let today = new Date()
  let todayInMilliseconds = today.getTime()
  let numMsin30Days = 30 * 24 * 60 * 60 * 1000
  let todayMinus30dNum = todayInMilliseconds - numMsin30Days
  let todayMinus30dObj = new Date(todayMinus30dNum)
  return todayMinus30dObj
}

function reformatDate(date) {
  const year = date.slice(0,4)
  const month = date.slice(5,7)
  const day = date.slice(8,10)
  return `${month}/${day}/${year}`
}

function reformatAmount(amt) {
  amt = amt.toString()
  if(amt[0] === '-') amt = amt[0] + '$' + amt.slice(1)
  else amt = '$' + amt
  if(amt[amt.length-2] === '.') amt = amt + '0'
  return amt;
}

function commaFormat(num) {
  let neg = false

  let strNum = num.toString()
  if (strNum[0] === '-') {
    strNum = strNum.slice(1, strNum.length)
    neg = true
  }
  let strSplit = strNum.split('.')
  let result = ''
  let digitSplit = strSplit[0].split('')
  let decSplit = (strSplit[1]) ? ('.'+strSplit[1]) : ('')
  let digitSplitMod = digitSplit.length % 3 - 1
  if (digitSplitMod < 0) {
    digitSplitMod += 3
  }

  if (digitSplit.length > 3) {
    for (let i=0; i<digitSplit.length-3; i++) {
    if (i % 3 === digitSplitMod) {
      digitSplit[i] = digitSplit[i] + ','
      }
    }
  }

  result = digitSplit.join('') + decSplit
  return ((neg) ? '-' : '') + "$"+result
  }

  function dataProcessor(dataObj) {
    let currentSalary = convertIncome(dataObj.currentSalary)
    let csGrowth = Number(dataObj.csGrowth)
    let expectedSalary = convertIncome(dataObj.expectedSalary)
    let esGrowth = Number(dataObj.esGrowth)
    let yearsOfSchool = Number(dataObj.yearsOfSchool)
    let retirementAge = Number(dataObj.retirementAge)
    let age = Number(dataObj.age)
    let tuition = convertIncome(dataObj.tuition)
    let livingExpenses = convertIncome(dataObj.livingExpenses)
    let discountRate = Number(dataObj.discountRate)
    let currentSalaryArray = [];
    let expectedSalaryArray = [];
    let yearArray = [];
    let i=1;
    let workingYears = retirementAge - age + 1
    let salary
    let currentSalarySum = 0
    let expectedSalarySum = 0 - tuition * yearsOfSchool
    let breakeven = []
    let currentSalaryNPVArray = []
    let expectedSalaryNPVArray = []
    let currentSalaryNPVArrayCum = []
    let expectedSalaryNPVArrayCum = []
    let previousSum = 0
    let breakevenNPV = []
    if (yearsOfSchool % 1 !== 0) {
      console.log('not whole number')
      tuition = yearsOfSchool * tuition / Math.floor(yearsOfSchool)
      yearsOfSchool = Math.floor(yearsOfSchool)
    }

    while (i < workingYears) {
      yearArray.push(i+age)
      salary = currentSalary * Math.pow((1+csGrowth / 100), i-1)
      currentSalaryArray.push(Math.round(salary))
      currentSalaryNPVArray.push(Math.round(salary /   Math.pow(1+discountRate/100, i)))
      currentSalarySum += salary
      previousSum = (i > 1) ? currentSalaryNPVArrayCum[i-2] : 0
      currentSalaryNPVArrayCum.push(currentSalaryNPVArray[i-1] + previousSum)

      if (i <= yearsOfSchool) {
        expectedSalaryArray.push(0)
        expectedSalaryNPVArray.push(-1*Math.round(tuition / Math.pow(1+discountRate/100, i)))
       } else {
        salary = expectedSalary * Math.pow((1+esGrowth / 100), i-1-yearsOfSchool)
        expectedSalaryArray.push(Math.round(salary))
        expectedSalarySum += salary
        expectedSalaryNPVArray.push(Math.round(salary / Math.pow(1+discountRate/100, i)))
       }
       previousSum = (i > 1) ? expectedSalaryNPVArrayCum[i-2] : 0
       expectedSalaryNPVArrayCum.push(expectedSalaryNPVArray[i-1] + previousSum)

       if(expectedSalarySum > currentSalarySum) {
         breakeven.push(i)
       }
       if(expectedSalaryNPVArrayCum[i-1] > currentSalaryNPVArrayCum[i-1]) {
         breakevenNPV.push(i)
       }
      i += 1
    }

    let returnObj = {
      dataCs: currentSalaryArray,
      dataEs: expectedSalaryArray,
      years: yearArray,
      breakeven: breakeven[0] || false,
      currentSalaryNPV: currentSalaryNPVArray,
      expectedSalaryNPVArray: expectedSalaryNPVArray,
      currentSalaryNPVCum: currentSalaryNPVArrayCum,
      expectedSalaryNPVCum: expectedSalaryNPVArrayCum,
      breakevenNPV: breakevenNPV[0] || false,
      tuition: tuition,
      yearsOfSchool: yearsOfSchool,
      age: age
    }

    return returnObj
  }



const getCategoryName = categoryId => {
	switch (categoryId) {
		case 1:
			return 'Monthly Expenses'
		case 3:
			return 'Shops'
		case 4:
			return 'Travel'
		case 6:
			return 'Recreation'
		case 7:
			return 'Other'
		case 8:
      return 'Savings'
    case 9:
      return 'Food and Drink'
    case 10:
      return 'Big Purchases'
		default:
			return 'Other'
	}
}

function getDaysRemaining() {
  let a = new Date()
  let b = a.getDate()
  a.setMonth((a.getMonth()+1) % 12)
  a.setDate(1)
  let c = a.getTime()
  c = c - 24 * 60 * 60  * 1000
  let d = new Date(c)
  let e = d.getDate()
  let returnObj = {
    lastDayOfMonth: e,
    daysRemaining: e-b,
    today: b
  }
  return returnObj
}

module.exports = {getMonthYear, formatDate, get30DaysAgo, reformatDate, reformatAmount, convertPhoneNumber, convertIncome, getCategoryName,commaFormat, dataProcessor, getDaysRemaining}
