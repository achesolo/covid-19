const estimatorFunc = require('./estimator.js');
var convert = require('xml-js');
var request = require('request');
var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const timeLogs = [];
//app.use(express.static('public'));
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/covid-19-estimated', (req,res)=>{
    fs.readFile(__dirname + '/' + '../inputData.json', 'utf8', (err,data)=>{
        console.log(data);
        res.end(data);
    })
})

//  

app.post('/api/v1/on-covid-19', urlencodedParser,  (req, res)=> {

   response = {
      population:req.body.population,
      timeToElapse:req.body.time_to_elapse,
      reportedCases:req.body.reported_cases,
      totalHospitalBeds:req.body.hospital_beds,
      periodType:req.body.period_type
   };
   fs.readFile(__dirname + '/' + '../inputData.json', 'utf8', (err,data)=>{
    data = JSON.parse( data );
    data.data.population = response.population;
    data.data.region.timeToElapse = response.timeToElapse;
    data.data.reportedCases = response.reportedCases;
    data.data.totalHospitalBeds = response.totalHospitalBeds;
    data.data.periodType = response.periodType;
    estimator = estimatorFunc.covid19ImpactEstimator(data.data);
  //  console.log(estimator.data)
    res.end(JSON.stringify(estimator));
    let start_time = new Date().getTime();            
            request.get('/api/v1/on-covid-19', function (err, response) {
                
                 reqTime= new Date().getTime() - start_time;
                covidLogs = JSON.stringify({
                   "timeStamp" : Date.now(),
                    "requestpath" : 'on-covid-19',
                    "timediff" : 'done in '+ reqTime + ' seconds'
                })
                timeLogs.push(covidLogs);
            })

        app.get('/api/v1/on-covid-19/json', (req,res)=>{ 
            res.end(JSON.stringify(estimator));
            let start_time = new Date().getTime();            
            request.get('/api/v1/on-covid-19/json', function (err, response) {
                
                 reqTime= new Date().getTime() - start_time;
                jsonLogs = JSON.stringify({
                   "timeStamp" : Date.now(),
                    "requestpath" : 'on-covid-19/json',
                    "timediff" : 'done in '+ reqTime + ' seconds'
                })
                timeLogs.push(jsonLogs);
        });
    })

        app.get('/api/v1/on-covid-19/xml', (req,res)=>{ 
            var options = {compact: true, ignoreComment: true, spaces: 4};
            var result = convert.json2xml(estimator, options);
            res.end(result)

            let start_time = new Date().getTime();            
            request.get('/api/v1/on-covid-19/xml', function (err, response) {
                
                 reqTime= new Date().getTime() - start_time;
                xmlLogs = JSON.stringify({
                   "timeStamp" : Date.now(),
                    "requestpath" : 'on-covid-19/xml',
                    "timediff" : 'done in '+ reqTime + ' seconds'
                })
                timeLogs.push(xmlLogs);
            });
        });

        app.get('/api/v1/on-covid-19/logs', (req,res,next)=>{ 
          //  jsonData={};

            for (let i=0;i<timeLogs.length; i++){
               jsonData =  JSON.parse(timeLogs[i])   
               res.end(jsonData.timeStamp + "\t\t" + jsonData.requestpath + "\t\t" + jsonData.timediff + "\n")         
            }
            console.log(jsonData)
           
        })
    })
})


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log('app listening on ',port);
})