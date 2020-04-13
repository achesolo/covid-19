const app = require('express');
const convert = require('xml-js');
const covidEstimator = require('./estimator');

const router = app.Router();

// middleware that is specific to this router
router.use('/api/v1/on-covid-19/logs', (req, res, next) => {
  const startTime = new Date().getTime();
  const reqTime = new Date().getTime() - startTime;

  req.headers('Content-Type', 'text/plain');
  res.send((`${Date.now()}\t\t${req.path}\t\t ${res.sendStatus(200)}\t\t${reqTime}ms\n`));
  next();
});
// define the home page route
router.get('/api/v1/on-covid-19', (req, res) => {
  res.send(covidEstimator(req.body));
});
// define the about route
router.post('/api/v1/on-covid-19', (req, res) => {
  res.send(covidEstimator(req.body));
});
router.post('/api/v1/on-covid-19/json', (req, res) => {
  res.json(covidEstimator(req.body));
});
router.post('/api/v1/on-covid-19/xml', (req, res) => {
  req.headers('Content-Type', 'application/xml; charset=UTF-8');
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const xmlResult = convert.json2xml((covidEstimator(req.body), options));
  res.send(xmlResult);
});

module.exports = router;
