const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

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
    const url = "https://us21.api.mailchimp.com/3.0/lists/96a9efeb85";
    const options = {
        method: "POST",
        auth: "chinmaybhalodia:92f11e99bc48f9d401c8719068559bbc-us21"
    };
    const request = https.request(url, options, (response)=>{
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
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

// 92f11e99bc48f9d401c8719068559bbc-us21
// 96a9efeb85