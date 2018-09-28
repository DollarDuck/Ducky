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

function get30DaysAgo() {
  let today = new Date()
  let todayInMilliseconds = today.getTime()
  let numMsin30Days = 30 * 24 * 60 * 60 * 1000
  let todayMinus30dNum = todayInMilliseconds - numMsin30Days
  let todayMinus30dObj = new Date(todayMinus30dNum)
  return todayMinus30dObj
}

module.exports = {formatDate, get30DaysAgo}
