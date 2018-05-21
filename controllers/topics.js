const {Topic, Article} = require('../models')

module.exports = {
    getAll (req, res, next) {
        Topic.find()
            .then(topics => res.send({topics}))
            .catch(next)
    },
    getArticles (req, res, next) {
        console.log(req.params)
        Article.find({'topic': 'cats'})
        .then(articles => res.send(articles))
        .catch(next)
    }
}