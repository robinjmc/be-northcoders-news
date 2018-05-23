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
        const newUser = Math.random().toString(18).substring(9) //only existing users should be about to post articles any attempt to postArticle w/out user should redirect to create new user page
        User.create({
            username: newUser,
            name: 'user' + newUser,
            avatar_url: 'http://standard.tj/img/general/avartar.jpg'
        }).then(user => {
            let userID = req.body.hasOwnProperty('user') ? req.body.user : user._id
            return Article.create({
                title: req.body.title,
                body: req.body.body, 
                belongs_to: req.params.topic_id, 
                created_by: userID
            })
        }).then(article => res.status(201).send(article))
    }
}