const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/getAccounts', (req, res) => {
  console.log("**** GET /getAccounts ****");
  res.send("");
  // truffle_connect.start(function (answer) {
  //   res.send(answer);
  // })
});


app.listen(port, () => {


  console.log("Express Listening at http://localhost:" + port);

});
