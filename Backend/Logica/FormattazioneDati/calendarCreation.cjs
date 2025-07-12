const convertData = require( './convertData.cjs')

//GENERAZIONE DATE
const today = new Date()
let tempData = new Date()

const calendar = new Map()

for( let i = 0 ; i < 100 ; i++){
    dataTemp = new Date( today.getFullYear() , today.getMonth() , today.getDate() + i)
    calendar.set( convertData(dataTemp) , false )
}

module.exports = calendar;