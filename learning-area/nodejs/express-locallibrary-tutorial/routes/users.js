var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/cool', function(req, res) {
  res.render('index', {title: 'You\'re cool!!!'});
})

module.exports = router;