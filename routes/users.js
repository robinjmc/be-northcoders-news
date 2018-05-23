const express = require('express');
const {users : {getUser}} = require('../controllers');

const router = express.Router();

router.get('/:username', getUser)

module.exports = router;