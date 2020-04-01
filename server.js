var express = require('express');
var app = express();
var moment = require('moment');
moment().format();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/timestamp/:date_string?", (req, res) => {
  const { date_string } = req.params;

  const userDate = moment(date_string);

  if (!userDate.isValid()) {
    return res.status(400).json({
      "error": "Invalid Date" 
    })
  }

  if (!date_string) {
    const utcDate = new Date(Date.now()).toUTCString();

    return res.status(200).json({
      "unix": Date.now(),
      "utc": utcDate,
    })
  }

  const unixFormat = new Date(date_string).getTime();
  const utcFormat = new Date(date_string).toUTCString();

  res.json({
    unix: unixFormat,
    utc: utcFormat
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port ' + listener.address().port + '...');
});