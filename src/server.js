// const express = require('express');

// const covid19Estimator = require('./estimator.js');

// const app = express();


// app.post('/api-v1-on-covid-19', (req, res) => {
//   const data = req.body;
//   res.json(covid19Estimator(data));
// });

const app = require('express');
const covidRouters = require('./router');


app.use('/api/v1/on-covid-19', covidRouters);

module.exports = app;
