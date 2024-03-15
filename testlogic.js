const config = require('./config/config');
const fs = require('fs');
const { arrToObjectData } = require("./lib");
const pool = require('./config/db')

const userData = fs.createReadStream('./sample.csv')
let rawData = ``

userData.on("data", (data) => {
    rawData += data;

});

userData.on("end", () => {

    console.log(rawData);
    const arrayData = rawData.replace(/\r\n/g, '\n').split("\n");
    console.log(arrayData);
    const [stringHeadData, ...arrayBodyData] = arrayData

    var attrs = arrayData.splice(0, 1);

    var result = arrayData.map(function (row) {
        var obj = {};
        var rowData = row.split(',');
        attrs[0].split(',').forEach(function (val, idx) {
            obj = constructObj(val, obj, rowData[idx]);
        });
        return obj;
    })


    function constructObj(str, parentObj, data) {
        if (str.split('.').length === 1) {
            parentObj[str] = data;
            return parentObj;
        }

        var curKey = str.split('.')[0];
        if (!parentObj[curKey])
            parentObj[curKey] = {};
        parentObj[curKey] = constructObj(str.split('.').slice(1).join('.'), parentObj[curKey], data);
        return parentObj;
    }

    const jsonObj=JSON.stringify(result)
    console.log(jsonObj)
});