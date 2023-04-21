var express = require('express');
var router = express.Router();
var Post = require('../models/post')

/* GET home feed page. */
router.get('/', async (req, res, next)=>{
    try {
        const posts = await Post.find().sort({ create_date: -1 }).populate('user')

        res.render('index', {
            title: 'Feed',
            user: req.user,
            posts
        })
    } catch (error) {
        next(error)
    }
    
});

module.exports = router;
