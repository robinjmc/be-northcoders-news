const {Article} = require('../models')

module.exports = {
    getAll (req, res, next) {
        Article.find()
            .then(articles => res.send({articles}))
            .catch(next)
    }
}