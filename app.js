

var bodyParser = require('body-parser')
const express = require('express')
const app = express()
const request = require('request')
const https = require("https");
const port = 3000

//specifies a static folder
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:true}));
app.post("/",function(req,res){

    const email = req.body.email;
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    
    console.log(firstName, secondName, email);
    

})


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
