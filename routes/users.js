const express = require('express');
const {users} = require('../controllers');

const router = express.Router();

router.get('/:username', users.getUser)

module.exports = router;