function catView(transArr) {
  let catObj = {}

  for (let i=0; i<transArr.length; i++) {
    if (catObj.hasOwnProperty(transArr[i].category[0])) {
      catObj[transArr[i].category[0]] += Math.round(transArr[i].amount*100)/100
    } else {
      catObj[transArr[i].category[0]] = Math.round(transArr[i].amount*100)/100
    }
  }
  return catObj

}
