const app = require('express');
const convert = require('xml-js');
const covidEstimator = require('./src/estimator');
const bodyParser = require('body-parser');
const fs = require('fs');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = app.Router();
// middleware that is specific to this router
router.get('/logs', (req, res, next) => {
  const startTime = new Date().getTime();
  const reqTime = new Date().getTime() - startTime;

  req.headers('Content-Type', 'text/plain');
  res.send((`${Date.now()}\t\t${req.path}\t\t ${res.sendStatus(200)}\t\t${reqTime}ms\n`));
  next();
});

router.get('/', (req,res) => {
  res.send(req.body);
})
// define the home page route
router.post('/', function(req, res) {
  req.header('Content-Type', 'application/json; charset=UTF-8');
    const estimator = covidEstimator(req.body.data);   
  res.send(estimator);
});

// router.post('/', urlencodedParser, (req, res) => {

//   fs.readFile(`${__dirname}/` + './src/inputData.json', 'utf8', (err, data) => {
//     data = JSON.parse(data);
//     const estimator = covidEstimator(data.data);
    
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

//     router.post('/json', (req, res) => {
//       res.json(JSON.stringify(estimator));
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

//     router.post('/xml', (req, res) => {
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

//     router.post('/logs', (req, res, next) => {
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

// define the about route

router.post('/json', urlencodedParser, (req, res) => {
  res.json(covidEstimator(req.body.data));
});
router.post('/xml', (req, res) => {
  req.headers('Content-Type', 'text/xml; charset=UTF-8');
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const xmlResult = convert.json2xml((covidEstimator(req.body.data), options));
  res.send(xmlResult);
});

module.exports = router;
