var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var routes = require('./routes');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(routes);
 
const port = process.env.PORT || 8080;

app.listen(port, () => {
   console.log("Running on port %s", port)
})