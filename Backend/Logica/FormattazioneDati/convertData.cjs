function convertData (data) {
    
    let dataString = "";

    dataString = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate()

    return dataString;
}
module.exports = convertData;