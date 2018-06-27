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
                const newUser = Math.random().toString(18).substring(9) //eventually only existing users should be about to post articles any attempt to postArticle w/out user should redirect to create new user page
                return User.create({
                    username: newUser,
                    name: 'user' + newUser,
                    avatar_url: 'http://standard.tj/img/general/avartar.jpg'
                })
            })
            .then(user => {
                let userID = req.body.hasOwnProperty('user') ? req.body.user : user._id
                return Article.create({
                    title: req.body.title,
                    body: req.body.body,
                    belongs_to: topic_id,
                    created_by: userID
                })
            })
            .then(article => {
                if (!article) throw { status: 404 }
                res.status(201).send(article)
            })

            .catch(next)

    }
}