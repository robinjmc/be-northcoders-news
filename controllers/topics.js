const { Topic, Article, User, Comment } = require('../models')

exports.getAll = (req, res, next) => {
    Topic.find()
        .then(topics => res.send({ topics }))
        .catch(next)
}
exports.getArticles = (req, res, next) => {
    Topic.findById(req.params.topic_id)
        .then(topic => {
            if(!topic) throw {status: 404}
            return Article.find({ 'belongs_to': topic._id }).lean()
        })
        .then(articles => {
            return Promise.all([Comment.find().lean(), articles])
        })
        .then(([commentArr, articles]) => {
            const belongsArr = commentArr.map(comment => comment.belongs_to)
            const articlesAndComments = articles.map(article => {
                const countComments = belongsArr.filter(belongID => {
                    return `${belongID}` === `${article._id}`
                })
                article.comment_count = countComments.length
                // return {...article, comment_count: countComments.length}
                return article
            })
            res.send(articlesAndComments)
        })
        .catch(next)
}
exports.postArticle = (req, res, next) => {
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