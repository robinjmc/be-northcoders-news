const { Topic, Article, User } = require('../models')

module.exports = {
    getAll(req, res, next) {
        Topic.find()
            .then(topics => res.send({ topics }))
            .catch(next)
    },
    getArticles(req, res, next) {
        Topic.findById(req.params.topic_id)
            .then(topic => {
                if (!topic) throw { status: 404 }
                return Article.find({ 'belongs_to': topic._id })
            })
            .then(articles => res.send(articles))
            .catch(next)
    },
    postArticle(req, res, next) {
        const { topic_id } = req.params
        Topic.findById(topic_id)
            .then(topic => {
                if (!topic) throw { status: 404 }
                return Article.create({
                    title: req.body.title,
                    body: req.body.body,
                    belongs_to: topic_id,
                    created_by: req.body.user
                })
            })
            .then(article => {
                if (!article) throw { status: 404 }
                res.status(201).send(article)
            })
            .catch(next)

    }
}