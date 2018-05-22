const express = require('express');
const {articles} = require('../controllers');

const router = express.Router();

router.get('/', articles.getAll)

router.get('/:article_id', articles.getByID)

router.get('/:article_id/comments', articles.getComments)

router.post('/:article_id/comments', articles.postComment)

router.put('/:article_id', articles.vote)

module.exports = router;