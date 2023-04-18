var express = require('express')
var router = express.Router()
var postController = require('../controllers/postController')

//Get details on post
router.get('/:id', postController.detail)

//Create post
router.post('/create', postController.create)

router.get('/:id/upvote', postController.toggle_upvote)

router.get('/:id/downvote', postController.toggle_downvote)

//Update post, get request
router.get('/:id/update')

//Update post, post request
router.post('/:id/update')

//Delete post, get request
router.get('/:id/delete')

//Delete post, post request
router.post('/:id/delete')

module.exports = router