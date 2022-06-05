

var bodyParser = require('body-parser');
const express = require('express');
const app = express();
var path = require('path');

const request = require('request');
const https = require("https");
const secrets = require("./secrets");
const { json } = require('body-parser');


//keys for heroku
const chimp_key = process.env.CHIMP_KEY;
const list_id = process.env.LIST_ID;

// var MailChimpAPI = require('mailchimp').MailChimpAPI;

// var apiKey = process.env.CHIMP_KEY;

// try { 
//   var api = new MailChimpAPI(apiKey, { version : '2.0' });
// } catch (error) {
//   console.log(error.message);
// }



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
      headers:{
        "Authorization" : "Ricardo" + chimp_key
        
      },
        body:jsonData

    };



    // const options = {
    //   
    //   method:"POST",
    //   headers:{
    //     "Authorization" : "Ricardo" + secrets['CHIMP_KEY']
        
    //   },
    //     body:jsonData

    // };

   const request = https.request(url, options ,function(response){

        if(response.statusCode === 200){
          res.sendFile(path.join(__dirname, '/success.html'));
        }else{
          res.sendFile(path.join(__dirname, '/failure.html'));
        }

        console.log("status code:", res.statusCode );

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


