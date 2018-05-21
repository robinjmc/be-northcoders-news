const express = require('express');
const {topics} = require('../controllers');

const router = express.Router();

router.get('/', topics.getAll)

router.get('/:topic/articles', topics.getArticles)

module.exports = router;