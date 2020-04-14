// // const express = require('express');

// // const covid19Estimator = require('./estimator.js');

// // const app = express();


// // app.post('/api-v1-on-covid-19', (req, res) => {
// //   const data = req.body;
// //   res.json(covid19Estimator(data));
// // });

 const express = require('express');
 const  app = express();
 const cors = require('cors');
 const covidRouters = require('./router');


// // app.get('/index.html', (req, res) => {
// //     res.sendFile(`${__dirname}/` + 'index.html');
// //   });
  

// //
    const server = app.listen(8081, () => {
    const host = server.address().address;
    const { port } = server.address();
     console.log('app listening at',host, port);
  });
  app.use(cors());
  app.use('/api/v1/on-covid-19', covidRouters);
  module.exports = app;