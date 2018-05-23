const express = require('express');
const {topics: {getAll, getArticles, postArticle}} = require('../controllers');

const router = express.Router();

router.get('/', getAll)

router.get('/:topic_id/articles', getArticles)

router.post('/:topic_id/articles', postArticle)

// router.route(/:topic_id/articles)
//        .get(getArticles)
//        .post(postArticle)


module.exports = router;