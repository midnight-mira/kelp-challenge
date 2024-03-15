const express = require('express')
const cors = require('cors')
const { createFile } = require("./converterlogic")

const app = express()
app.use(express.json())
app.use(cors())
const port = 5001

app.post('/', createFile)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})