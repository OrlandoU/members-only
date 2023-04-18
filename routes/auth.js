var express = require('express')
var router = express.Router()
var passport = require('passport')
var authController = require('../controllers/authController')

router.get('/login', authController.login_get)

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login'
}),(req, res)=>{
    if(req.user){
        res.redirect('/')
    }
})

router.get('/sign-up', authController.sign_get)

router.post('/sign-up', authController.sign_post)

router.get('/logout', authController.logout)

module.exports = router