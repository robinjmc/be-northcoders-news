const express = require('express');
const {comments} = require('../controllers');

const router = express.Router();

router.put('/:comment_id', comments.vote)

router.delete('/:comment_id', comments.delete)

module.exports = router;