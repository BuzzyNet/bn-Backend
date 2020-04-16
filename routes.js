const router = require('express')()
const config = require('./config')

router.get(config.baseurl + 'login', (req, res) => {
    res.send("Login Route Triggered")
});

module.exports = router