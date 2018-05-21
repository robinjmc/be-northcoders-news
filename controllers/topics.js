const {Topic, Article} = require('../models')

module.exports = {
    getAll (req, res, next) {
        Topic.find()
            .then(topics => res.send({topics}))
            .catch(next)
    },
    getArticles (req, res, next) {
        Topic.findOne({'slug': req.params.topic})
        .then(topic => {
            Article.find({'belongs_to': topic._id})
            .then(articles => res.send(articles))
        })
        .catch(next)
    }
}