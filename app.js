const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const config = require("./config.json");
const apikey = config.API_KEY;
const listID = config.LIST_ID;
console.log(apikey);
console.log(listID);

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",(req,res)=>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    const jsondata = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/"+listID;
    const options = {
        method: "POST",
        auth: "chinmaybhalodia:"+apikey
    };
    const request = https.request(url, options, (response)=>{
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            console.log(response.statusCode);
            res.sendFile(__dirname+"/failure.html");
        }
    });
    request.write(jsondata);
    request.end();
});

app.post("/failure",(req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("Running on port 3000.");
});