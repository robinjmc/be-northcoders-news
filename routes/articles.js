const express = require('express');
const {articles} = require('../controllers');

const router = express.Router();

router.get('/', articles.getAll)

module.exports = router;