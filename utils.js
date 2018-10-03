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
  console.log('here', income)
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

module.exports = {formatDate, get30DaysAgo, reformatDate, reformatAmount, convertPhoneNumber, convertIncome}
