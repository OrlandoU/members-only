var express = require('express');
var router = express.Router();

/* GET home feed page. */
router.get('/', (req, res, next)=>{
    res.render('index', {
        title: 'Feed Page'
    })
});

module.exports = router;
