var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')

/* GET users listing. */
router.get('/', userController.detail);

router.get('/settings', userController.settings_get)

router.post('/settings', userController.settings_post)

router.get('/updateStatus', userController.updateStatus_get)

router.post('/updateStatus', userController.updateStatus_post)

router.get('/activate-admin', userController.activate_admin_get)

router.post('/activate-admin', userController.activate_admin_post)

module.exports = router;
