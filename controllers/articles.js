const {Article, Comment} = require('../models')

module.exports = {
    getAll (req, res, next) {
        Article.find()
            .then(articles => res.send({articles}))
            .catch(next)
    },
    getComments (req, res, next) {
        Comment.find({'belongs_to': req.params.article_id})
        .then(comments => res.send(comments))
        .catch(next)
    }
}