

var bodyParser = require('body-parser')
const express = require('express')
const app = express()
const request = require('request')
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
