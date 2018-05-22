const express = require('express');
const {topics} = require('../controllers');

const router = express.Router();

router.get('/', topics.getAll)

router.get('/:topic_id/articles', topics.getArticles)

router.post('/:topic_id/articles', topics.postArticle)

module.exports = router;