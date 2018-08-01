const express = require('express');
const {comments: {vote, deleteComment}} = require('../controllers');

const router = express.Router();

router.route('/:comment_id')
        .put(vote)
        .delete(deleteComment)

module.exports = router;