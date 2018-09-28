const formatDate = () => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1; //January is 0!
  let mm2 = mm - 1
  if(dd.toString().length < 2) {
    dd = "0" + dd
  }
  if(mm.toString().length < 2) {
    mm = "0" + mm
  }
  if(mm2.toString().length < 2) {
    mm2 = "0" + mm2
  }
  const yyyy = today.getFullYear();
  const endDate = yyyy+ '-' + mm + '-' + dd
  const startDate = yyyy+ '-' + mm2 + '-' + dd

  return [endDate, startDate]
}

module.exports = {formatDate}
