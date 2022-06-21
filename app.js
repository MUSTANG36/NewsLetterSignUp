
// jshint esversion: 6
require("dotenv").config();
var bodyParser = require('body-parser');
const express = require('express');
const app = express();
var path = require('path');

const request = require('request');
const https = require("https");

const { json } = require('body-parser');
const { response } = require('express');




//keys
const chimp_key = process.env.CHIMP_KEY;
const list_id = process.env.LIST_ID;




//provides a path  to our a static files for nodemon local host 3000
app.use(express.static("public"));


app.use(bodyParser.urlencoded({extended:true}));

app.post("/", function(req,res){

    const email = req.body.email;
    const firstName = req.body.fName;
    const lastName = req.body.lName;

    console.log(firstName, lastName, email);
    
    var data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields:{
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    };


    //Turning JS data into a flatpack JSON
    //this will be sent to mail chimp 
    var jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/" + list_id;
    

    const options = {
      method:"POST",
      auth: "Ricardo:" + chimp_key,
      
    };

//secrets['API_KEY']

   const request = https.request(url, options ,function(response){

        if(response.statusCode === 200){
          res.sendFile(path.join(__dirname, '/success.html'));
        }else{
          res.sendFile(path.join(__dirname, '/failure.html'));
        }

        
        response.on("data",function(data){
          console.log(JSON.parse(data));
        })
    });

    //write to the monkey server 
    request.write(jsonData);
    request.end();

});

//specify route
app.get('/', (req, res) => {
  //response.send(chimp_key);
  res.sendFile(__dirname + "/signup.html");
});

//Dynamic port that Heroku will define on the go
// process.env.PORT
app.listen(process.env.PORT || 3000,() => {
  
  console.log("starting site...Ready");
  
});



app.post('/failure.html', function(req,res){
  res.redirect("/");
});


