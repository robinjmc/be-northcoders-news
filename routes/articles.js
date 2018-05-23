const express = require('express');
const {articles : {getAll, getByID, getComments, postComment, vote}} = require('../controllers');

const router = express.Router();

router.get('/', getAll)

router.get('/:article_id', getByID)

router.get('/:article_id/comments', getComments)

router.post('/:article_id/comments', postComment)

router.put('/:article_id', vote)

module.exports = router;