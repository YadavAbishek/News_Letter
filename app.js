const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/failure", (req, res) => {
  res.redirect("/");
})

app.post("/", (req, res) => {
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;

  // const apiKey = "82d302636f13c245d91a2f18a3937916-us21";
  const listid = "935a2d4fb1";

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME:lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists" + "/" + listid;

  const options = {
    method: "POST",
    auth: "nilanshu:82d302636f13c245d91a2f18a3937916-us21"
  }
  const request = https.request(url, options, (response) => {
    if(response.statusCode === 200)
      res.sendFile(__dirname + "/success.html");
    else
      res.sendFile(__dirname + "/failure.html")

    response.on('data' , (d) => {
      const dat = JSON.parse(d);
    })
  })

  request.write(jsonData);
  request.end();

})

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on port 3000");
})
