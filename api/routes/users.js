const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const UsersController = require('../controllers/users')
router.get('/', checkAuth, UsersController.users_get_users);
router.post('/login', UsersController.users_login_user)
router.post('/signup', UsersController.users_register_user)
router.get('/:userId', checkAuth, UsersController.users_get_user)
router.delete('/:userId', checkAuth, UsersController.users_delete_user)
module.exports = router