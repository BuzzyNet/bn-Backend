var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

var routes = require("./routes");

const config = require("./config")[process.env.ENV];

try {
  const dbSecrets = require("./dbSecrets");
  config.dbUrl = dbSecrets.dbUrl;
} catch (e) {
  if (e.code === "MODULE_NOT_FOUND") {
    console.warn(`dbSecrets file not found using dbUrl as ${config.dbUrl}`);
  }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

mongoose.connect(
  config.dbUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`serving from db: ${config.dbUrl}`);
  }
);

const port = process.env.PORT || config.port;

app.listen(port, () => {
  console.log("Running on port %s", port);
});
