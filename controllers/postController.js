const {body, validationResult} = require('express-validator')
const Post = require('../models/post')

exports.detail = (req, res, next) => {

}

exports.create = [
    body('content')
    .trim()
    .escape()
    .isLength({max: 300})
    .withMessage('Invalid content length, Max length 300 chars')
    , async (req, res, next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            res.render('index', {
                user: req.user,
                errors: errors.array()
            })
        } 

        try {
            const post = new Post({
                user: req.user.id,
                content: req.body.content
            })
            await post.save()
            res.redirect('/')
        } catch (error) {
            return next(error)
        }
    }
]

exports.toggle_upvote = async (req, res) => {
    if(!req.user){
        return res.redirect('/')
    }

    const post = await Post.findById(req.params.id)

    if(post.downvotes.includes(req.user._id)){
        post.downvotes.pull(req.user._id)
        post.upvotes.push(req.user._id)
    } else if(post.upvotes.includes(req.user._id)){
        post.upvotes.pull(req.user._id)
    } else {
        post.upvotes.push(req.user._id)
    }

    await post.save()
    const posts = await Post.find({}).sort({ create_date: -1 }).populate('user')

    res.render('index', {
        title: 'Feed Page',
        user: req.user,
        posts,
        postId: req.params.id
    })
}

exports.toggle_downvote = async (req, res) =>{
    if (!req.user) {
        return res.redirect('/')
    }
    const post = await Post.findById(req.params.id)

    if (post.upvotes.includes(req.user._id)) {
        post.upvotes.pull(req.user._id)
        post.downvotes.push(req.user._id)
    } else if (post.downvotes.includes(req.user._id)) {
        post.downvotes.pull(req.user._id)
    } else {
        post.downvotes.push(req.user._id)
    }

    await post.save()
    const posts = await Post.find({}).sort({ create_date: -1 }).populate('user')

    res.render('index', {
        title: 'Feed Page',
        user: req.user,
        posts,
        postId: req.params.id
    })
}


exports.update_post = (req, res, next) => {
    
}