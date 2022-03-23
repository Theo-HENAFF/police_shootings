let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {});
});
router.get('/police', function (req, res, next) {
    res.render('police.ejs', {});
});
router.get('/folder', function (req, res, next) {
    res.render('folder.ejs', {});
});

module.exports = router;
