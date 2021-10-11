const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const request = require("request");
const https = require("https");

app.use(express.static("public"));

// For taking inputs 
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // console.log(firstName, lastName, email);
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us5.api.mailchimp.com/3.0/lists/936b95e726";
    const options = {
        method: "POST",
        auth: "jaiminocha:4acbdb744ed65d1cd955cb5da7eca9d4-us5"
    }

    const request = https.request(url, options, function(response) {
        if (response.statusCode == 200) {
            //  res.send("Successfully Subscribed");
            res.sendFile(__dirname + "/success.html");
        } else {
            // res.send("There was an error with signing up, please try again :(")
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is up and running!");
});

// API key
// 4acbdb744ed65d1cd955cb5da7eca9d4-us5

// List ID
// 936b95e726