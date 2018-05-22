const {Article, Comment, User} = require('../models')

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
    },
    postComment (req, res, next) {
        if(!req.body.hasOwnProperty('user')) {
            const newUser = Math.random().toString(18).substring(9)
            User.create({
                username: newUser,
                name: 'user' + newUser,
                avatar_url: 'http://standard.tj/img/general/avartar.jpg'
            }).then(user => {
                Comment.create({
                    body: req.body.comment, 
                    belongs_to: req.params.article_id, 
                    created_by: user._id
                })
                .then(comment => {
                    res.send(comment)
                })
            })
        } else {
            Comment.create({
                body: req.body.comment, 
                belongs_to: req.params.article_id, 
                created_by: req.body.user
            })
            .then(comment => {
                res.send(comment)
            })
        }
        // else user.find({username: defaultUser}).then...
    }
}