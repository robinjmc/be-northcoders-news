const express = require('express');
const {articles} = require('../controllers');

const router = express.Router();

router.get('/', articles.getAll)

router.get('/:article_id/comments', articles.getComments)

module.exports = router;