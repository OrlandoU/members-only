var express = require('express')
var router = express.Router()
var postController = require('../controllers/postController')

//Get details on post
router.get('/:id', postController.detail)

//Create post
router.post('/create', postController.create)

router.get('/:id/upvote', postController.toggle_upvote)

router.get('/:id/downvote', postController.toggle_downvote)

//Delete post, get request
router.get('/:id/delete', postController.delete_get)

//Delete post, post request
router.post('/:id/delete', postController.delete_post)

module.exports = router