

var bodyParser = require('body-parser');
const express = require('express');
const app = express();
var path = require('path');

const request = require('request');
const https = require("https");



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


    const url = "https://us14.api.mailchimp.com/3.0/lists/310eed242b";

    const options = {
      method:"POST",
      auth:"ricky:0f4c9c7182927661f2a7c28c70e346a-us14"
    };

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
  res.sendFile(__dirname + "/signup.html");
});

//Dynamic port that Heroku will define on the go
// process.env.PORT
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
});



app.post('/failure.html', function(req,res){
  res.redirect("/");
});


