const express = require('express');
const { createUser, loginUser, UserList} = require('../controller/Auth');
const {authenticate, authorize} = require('../middlware/authenticate');
const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.get('/userList', authenticate, authorize(['teacher']), UserList);
module.exports = router;
