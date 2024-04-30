var express = require('express');
var router = express.Router();
var path = require('path');
var base = path.join(__dirname.slice(0, __dirname.indexOf('routes')), 'views/mobile');

router.get('/', function(req, res, next) {
    res.sendFile(`${base}/index.html`);
});

module.exports = router;