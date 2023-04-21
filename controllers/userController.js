const User = require('../models/user')
const Post = require('../models/post')
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')

exports.detail = async(req, res, next) => {
    try {
        const result = await Post.aggregate([
            {
                $match: { user: req.user._id }
            },
            {
                $group: {
                    _id: '$user',
                    total_upvotes: { $sum: { $size: '$upvotes' } },
                    total_downvotes: { $sum: { $size: '$downvotes'}}
                }
            }
        ]);

        const upvotes = result.length ? result[0].total_upvotes : 0
        const downvotes = result.length ? result[0].total_downvotes : 0
        const messages = await Post.countDocuments({user: req.user._id})
        const posts = await Post.find({user: req.user._id}).populate('user')

        res.render('user_detail',  {
            title: req.user.first_name + "Profile",
            user: req.user,
            upvotes,
            downvotes,
            messages,
            posts
        })
    } catch (error) {
        return next(error)
    }
    
}

exports.settings_get = (req, res, next)=>{
    res.render('user_update',  {
        title: 'Update user credentials',
        user: req.user
    })
}

exports.settings_post = [
    body('firstName')
        .trim()
        .escape()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name: Invalid length')
        .isAlpha()
        .withMessage('First name: Invalid Characters')
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
    body('oldPassword')
        .trim()
        .escape()
        .custom(async(value, { req }) => {
            if(!req.body.password && !value){
                return true
            }
            const result = await bcrypt.compare(value, req.user.password)
            if (!result) {
                throw new Error('Incorrect old password');
            }
            return true
        })
    ,
    body('password')
        .optional({checkFalsy: true})
        .trim()
        .escape()
        .isLength({ min: 8 })
        .withMessage('Password: Invalid length, min 8')
    , async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('user_update', {
                title: 'Error updating user credentials',
                user: req.user,
                errors: errors.array(),
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            let user
            if(req.body.password){
                user = new User({
                    _id: req.user._id,
                    first_name: req.body.firstName,
                    last_name: req.body.lastName,
                    password: hashedPassword,
                    email: req.body.email,
                });
            }else {
                user = new User({
                    _id: req.user._id,
                    first_name: req.body.firstName,
                    last_name: req.body.lastName,
                    email: req.body.email,
                });
            }
            user = await User.findByIdAndUpdate(req.user._id, user);

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

exports.updateStatus_get = (req, res, next) => {
    res.render('user_update_status', {
        user: req.user
    })
}

exports.updateStatus_post = async (req, res, next) => {
    try {
        if (req.body.passcode === 'tecnico') {
            await User.findByIdAndUpdate(req.user._id, { isMember: true, member_date: new Date() })
        }
        res.redirect('/')
    } catch (error) {
        return next(error)
    }
}

exports.activate_admin_get = (req, res, next) => {
    res.render('user_admin', {
        user: req.user
    })
}

exports.activate_admin_post = async (req, res, next) => {
    try {
        if (req.body.passcode === 'Gabriel03') {
            await User.findByIdAndUpdate(req.user._id, { isAdmin: true })
        }
        res.redirect('/')
    } catch (error) {
        return next(error)
    }
}
