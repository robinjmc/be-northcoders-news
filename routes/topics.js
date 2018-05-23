const express = require('express');
const {topics: {getAll, getArticles, postArticle}} = require('../controllers');

const router = express.Router();

router.get('/', getAll)

router.route('/:topic_id/articles')
        .get(getArticles)
        .post(postArticle)


module.exports = router;