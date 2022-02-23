

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
    
    var data = {
      members: [
        {
          email_address:email,
          status: "subscribed",
          merge_fields:{
            FNAME: firstName,
            LNAME: secondName
          }
        }
      ]
    };

    //this will be sent to mail chimp 
    var jsonData = JSON.stringify(data);


    const url = "https://$API_SERVER.api.mailchimp.com/3.0/lists/310eed242b";

    const options = {
      method:"POST",
      auth:"ricky:60f4c9c7182927661f2a7c28c70e346a-us14"
    }

   const request = https.request(url, options ,function(response){
        response.on("data",function(data){
          console.log(JSON.parse(data))
        })
    })


    request.write(jsonData);
    request.end();

});


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



//mail chimp API key
//60f4c9c7182927661f2a7c28c70e346a-us14


//audience ID
//310eed242b