/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const covid19Estimator = require('./src/estimator');
const convert = require('xml-js');
const request = require('request');
const express = require('express');
var router = express.Router();
const fs = require('fs');

const app = express();
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const timeLogs = [];

app.get('/index.html', (req, res) => {
  res.sendFile(`${__dirname}/` + 'index.html');
});

app.get('/api/v1/on-covid-19', (req, res) => {
  fs.readFile(`${__dirname}/` + './src/inputData.json', 'utf8', (err, data) => {
    console.log(data);
    res.end(data);
  });
});
app.post('/api/v1/on-covid-19', urlencodedParser, function(req, res) {
  console.log('receiving data ...');
  console.log('body is ',req.body);
  res.send(req.body);
});
//

// app.post('/api/v1/on-covid-19', urlencodedParser, (req, res) => {
//   const response = {
//     population: req.body.population,
//     timeToElapse: req.body.time_to_elapse,
//     reportedCases: req.body.reported_cases,
//     totalHospitalBeds: req.body.hospital_beds,
//     periodType: req.body.period_type
//   };
//   fs.readFile(`${__dirname}/` + './src/inputData.json', 'utf8', (err, data) => {
//     data = JSON.parse(data);
//     data.data.population = Math.trunc(response.population);
//     data.data.timeToElapse = Math.trunc(response.timeToElapse);
//     data.data.reportedCases = Math.trunc(response.reportedCases);
//     data.data.totalHospitalBeds = Math.trunc(response.totalHospitalBeds);
//     data.data.periodType = response.periodType;
//     const estimator = covid19Estimator(data.data);
    
//     res.end(JSON.stringify(estimator));
//     const startTime = new Date().getTime();
//     request.get('/api/v1/on-covid-19', (err, response) => {
//       const reqTime = new Date().getTime() - startTime;
//       const covidLogs = JSON.stringify({
//         timeStamp: Date.now(),
//         requestpath: 'on-covid-19',
//         timediff: `done in ${reqTime} seconds`
//       });
//       timeLogs.push(covidLogs);
//     });

//     app.get('/api/v1/on-covid-19/json', (req, res) => {
//       res.end(JSON.stringify(estimator));
//       // const startTime = new Date().getTime();
//       request.get('/api/v1/on-covid-19/json', (err, response) => {
//         reqTime = new Date().getTime() - startTime;
//         jsonLogs = JSON.stringify({
//           timeStamp: Date.now(),
//           requestpath: 'on-covid-19/json',
//           timediff: `done in ${reqTime} seconds`
//         });
//         timeLogs.push(jsonLogs);
//       });
//     });

//     router.get('/api/v1/on-covid-19/xml', (req, res) => {
//       const options = { compact: true, ignoreComment: true, spaces: 4 };
//       const result = convert.json2xml(estimator, options);
//       res.end(result);

//       const start_time = new Date().getTime();
//       request.get('/api/v1/on-covid-19/xml', (err, response) => {
//         reqTime = new Date().getTime() - start_time;
//         xmlLogs = JSON.stringify({
//           timeStamp: Date.now(),
//           requestpath: 'on-covid-19/xml',
//           timediff: `done in ${reqTime} seconds`
//         });
//         timeLogs.push(xmlLogs);
//       });
//     });

//     router.get('/api/v1/on-covid-19/logs', (req, res, next) => {
//       logstimeStamp = [];
//       logsreqPath = [];
//       logstimediff = [];

//       for (let i = 0; i < timeLogs.length; i++) {
//         jsonData = JSON.parse(timeLogs[i]);
//         res.end(`${jsonData.timeStamp}\t\t${jsonData.requestpath}\t\t${jsonData.timediff}\n`);
//       }
//     });
//   });
// });


const server = app.listen(process.env.PORT, () => {
  const host = server.address().address;
  const { port } = server.address();
   console.log('app listening on ', port);
});

module.exports = app;
