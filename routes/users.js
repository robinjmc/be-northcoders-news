const express = require('express');
const {users : {getAll, getUser}} = require('../controllers');

const router = express.Router();

router.get('/', getAll)

router.get('/:user_id', getUser)

module.exports = router;