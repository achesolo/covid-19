// const express = require('express');

// const covid19Estimator = require('./estimator.js');

// const app = express();


// app.post('/api-v1-on-covid-19', (req, res) => {
//   const data = req.body;
//   res.json(covid19Estimator(data));
// });

const express = require('express');
const  app = express();
const covidRouters = require('./router');


app.use('/api/v1/on-covid-19', covidRouters);

//module.exports = app;
    const server = app.listen(8081, () => {
    const host = server.address().address;
    const { port } = server.address();
     console.log('app listening on ', port);
  });
