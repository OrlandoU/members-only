const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')

exports.login_get = (req, res, next) => {
    res.render('login', {
        user: req.user
    })
}

exports.sign_get = (req, res, next) => {
    res.render('sign_up', {
        user: req.user
    })
}

exports.sign_post = [
    body('firstName')
        .trim()
        .escape()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name: Invalid length')
        .isAlpha()
        .withMessage('First name: Invalid Characters, just Alpha')
    ,
    body('lastName')
        .trim()
        .escape()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name: Invalid length')
        .isAlpha()
        .withMessage('Last name: Invalid Characters, just Alpha')
    ,
    body('email')
        .trim()
        .escape()
        .isEmail()
        .withMessage('Email: Invalid Email')
    ,
    body('password')
        .trim()
        .escape()
        .isLength({ min: 8 })
        .withMessage('Password: Invalid length, min 8')
        .custom((value, { req }) => {
            if (value !== req.body.confirmationPassword) {
                throw new Error('Password confirmation does not match password');
            }
            return true
        })
    , async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('sign_up', {
                errors: errors.array(),
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User({
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                password: hashedPassword,
                email: req.body.email,
            });

            await user.save();

            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        } catch (error) {
            return next(error);
        }
    }
]

exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
    })
    res.redirect('/')
}