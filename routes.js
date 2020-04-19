const router = require("express").Router();
const login = require("./Modules/login");
const fs = require("fs");
const path = require("path");

class Router {
  constructor() {
    this.router = router;
    this.router.get("/", (req, res) => {
      res.send("heyy");
    });

    this.router.get("/login", (req, res) => {
      // const val = login(req.body.username, req.body.password);
      res.send("Login Route Triggered");
    });

    fs.readdirSync(path.join(__dirname + "/routes")).forEach((filename) => {
      const moduleName = filename.split(".")[0];
      const subRouter = require(`./routes/${moduleName}`);

      this.router.use(`/${moduleName}`, subRouter);
    });

    // console.log(this.router.stack);
  }
}

module.exports = () => {
  return new Router().router;
};
