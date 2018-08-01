const express = require('express');
const {articles : {getAll, getByID, getComments, postComment, vote}} = require('../controllers');

const router = express.Router();

router.get('/', getAll)

router.route('/:article_id')
        .get(getByID)
        .put(vote)

router.route('/:article_id/comments')
        .get(getComments)
        .post(postComment)

module.exports = router;