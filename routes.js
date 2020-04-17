const router = require("express")();
const config = require("./config");

const login = require("./Modules/login");

router.get(config.baseurl + "login", (req, res) => {
  const val = login(req.body.username, req.body.password);
  res.send("Login Route Triggered");
});

module.exports = router;
