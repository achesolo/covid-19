var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//app.use(express.static('public'));
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/covid-19-data', (req,res)=>{
    fs.readFile(__dirname + '/' + '../inputData.json', 'utf8', (err,data)=>{
        console.log(data);
        res.end(data);
    })
})

app.post('/postData', urlencodedParser,  (req, res)=> {

   response = {
      population:req.body.population,
      timeToElapse:req.body.time_to_elapse,
      reportedCases:req.body.reported_cases,
      totalHospitalBeds:req.body.hospital_beds,
      periodType:req.body.period_type
   };
 //  console.log(response);
   res.end(JSON.stringify(response));
})


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log('app listening on ',port);
})