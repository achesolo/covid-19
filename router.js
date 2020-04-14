const express = require('express');
const convert = require('xml-js');
const covidEstimator = require('./src/estimator');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();

//const router = app.Router();

// middleware that is specific to this router
app.use('logs', (req, res, next) => {
  const startTime = new Date().getTime();
  const reqTime = new Date().getTime() - startTime;

  req.headers('Content-Type', 'text/plain');
  res.send((`${Date.now()}\t\t${req.path}\t\t ${res.sendStatus(200)}\t\t${reqTime}ms\n`));
  next();
});
// define the home page route
app.get('/api/v1/on-covid-19/', (req, res) => {
 // res.end(covidEstimator(req.body));
 res.send("heelo body")
});
// define the about route
app.post('/api/v1/on-covid-19/', urlencodedParser, (req, res) => {
  res.end(covidEstimator(req.body));
});
app.post('/api/v1/on-covid-19/json', urlencodedParser, (req, res) => {
  res.json(covidEstimator(req.body));
});
app.post('/api/v1/on-covid-19/xml', urlencodedParser, (req, res) => {
  req.headers('Content-Type', 'application/xml; charset=UTF-8');
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const xmlResult = convert.json2xml((covidEstimator(req.body), options));
  res.send(xmlResult);
});

module.exports = app;