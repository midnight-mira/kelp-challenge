const config = require('./config/config');
const fs = require('fs');
const pool = require('./config/db')

const createFile = (async (req, res) => {
    const filePathObj = req.body
    const filePath = filePathObj.file; // Extract the file path string

    const userData = fs.createReadStream(filePath, "utf-8")
    let rawData = ``

    userData.on("data", (data) => {
        rawData += data;
    });

    userData.on("end", () => {
        const arrayData = rawData.replace(/\r\n/g, '\n').split("\n");
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

        const data = result

        const insertData = async() => {
            const separatedData = data.map(item => {
                const { name, age, ...rest } = item;
                const fullname = name.firstname + name.lastname
                console.log(name)
                return { fullname, age, rest}
            });
            const add = pool.query(`INSERT INTO users(name, age, rest) VALUES (${separatedData})`)

            const lessThan20 = pool.query('SELECT COUNT(age) from users WHERE age < 20 ')

            const total = pool.query("SELECT COUNT(age) from users")

            const range20to40 = pool.query('SELECT COUNT(age) FROM users WHERE age BETWEEN 20 AND 40')
            const range40to60  =pool.query('SELECT COUNT(age) FROM users WHERE age BETWEEN 40 AND 60')
            const above60 = pool.query('SELECT COUNT(age) FROM users WHERE age > 60')

            const range20to40Percent = Math.floor((100 *range20to40 )/ total)
            const range40to60Percent = Math.floor((100 *range40to60 )/ total)
            const range60Percent = Math.floor((100 *above60 )/ total)
            const less20 = Math.floor((100 *lessThan20 )/ total)

            console.log(
                `Age-Group \t % Age Distribution \n` 
                `< 20: \t ${less20} \n`
                `20-40: \t ${range20to40} \n`
                `40-60: \t ${range40to60} \n`
                `> 60: \t ${range60Percent} \n`
            )

        }
        

        insertData()



    });

}
)

module.exports = { createFile }
