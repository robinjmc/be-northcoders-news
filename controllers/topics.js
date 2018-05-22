const {Topic, Article, User} = require('../models')

module.exports = {
    getAll (req, res, next) {
        Topic.find()
            .then(topics => res.send({topics}))
            .catch(next)
    },
    getArticles (req, res, next) {
        Topic.findOne({'slug': req.params.topic_id})
        .then(topic => {
            Article.find({'belongs_to': topic._id})
            .then(articles => res.send(articles))
        })
        .catch(next)
    },
    postArticle (req, res, next) {
        if(!req.body.hasOwnProperty('user')) {
            const newUser = Math.random().toString(18).substring(9)
            User.create({
                username: newUser,
                name: 'user' + newUser,
                avatar_url: 'http://standard.tj/img/general/avartar.jpg'
            }).then(user => {
                return Article.create({
                    title: req.body.title,
                    body: req.body.body, 
                    belongs_to: req.params.topic_id, 
                    created_by: user._id
                })
            }).then(Article => {
                res.status(201)
                res.send(Article)
            })
        } else {
            Article.create({
                title: req.body.title,
                body: req.body.body,  
                belongs_to: req.params.topic_id, 
                created_by: req.body.user
            })
            .then(Article => {
                res.status(201)
                res.send(Article)
            })
            .catch(next)
        }
    }
}