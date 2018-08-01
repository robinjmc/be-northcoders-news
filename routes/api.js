const express = require('express');
const {articles, comments, topics, users, landing} = require('./index')

const router = express.Router();

router.use('/articles', articles);

router.use('/comments', comments);

router.use('/topics', topics);

router.use('/users', users);

module.exports = router;