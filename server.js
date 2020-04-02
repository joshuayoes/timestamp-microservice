var express = require("express");
var app = express();
var moment = require("moment");
moment().format();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// returns current time
app.get("/api/timestamp", (req, res) => {
  const utcDate = new Date(Date.now()).toUTCString();

  res.status(200).json({
    unix: Date.now(),
    utc: utcDate
  });
});

// returns time if passed ISO or Unix via URL params
app.get("/api/timestamp/:date_string", (req, res) => {
  let { date_string } = req.params;

  // tests to see if input is unix timestamp or iso timestamp 
  const isUnixTimestamp = /\d{5,}/g.test(date_string);
    
  // transform pure number param (i.e. Unix timestamp) from string to integer
  // i.e. "/api/timestamp/1450137600000"
  if (isUnixTimestamp) {
    let date_int = parseInt(date_string);
    
    return res.json({
      unix: date_int,
      utc: new Date(date_int).toUTCString()
    })
  }
  
  // check to see param is valid for Date constructor 
  const validDateInput = new Date(date_string).toString();
  
  // send error response if invalid param
  if (validDateInput == "Invalid Date") {
    return res.json({
      error: "Invalid Date"
    })
  }

  // assume at this point, param is ISO format
  const unixFormat = new Date(date_string).getTime();
  const utcFormat = new Date(date_string).toUTCString();

  res.json({
    unix: unixFormat,
    utc: utcFormat
  });
});

// listen for requests
var listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + listener.address().port + "...");
});
