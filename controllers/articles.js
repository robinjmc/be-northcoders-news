const {Article, Comment, User} = require('../models')
// populate
module.exports = {
    getAll (req, res, next) {
        Article.find().lean()
        .then(articles => {
            Promise.all([Comment.find().lean(), articles])
                .then(([commentArr, articles]) => {
                    const belongsArr = commentArr.map(comment => comment.belongs_to)
                    const articlesAndComments = articles.map(article => {
                        const countComments = belongsArr.filter(belongID => {
                            return `${belongID}` === `${article._id}`
                        })
                        article.comment_count = countComments.length
                        return article
                    })
                res.status(200).send(articlesAndComments)
                }) 
            })
        .catch(next)
    },
    getByID (req, res, next) {
        Article.findById(req.params.article_id)
        .then(article => {
            res.send(article)
        })
        .catch(next)
        // (err =>  {
        //    'casterror' return next({status:404})
        // })
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
                return Comment.create({
                    body: req.body.comment, 
                    belongs_to: req.params.article_id, 
                    created_by: user._id
                })
            }).then(comment => {
                res.status(201).send(comment)
            })
        } else {
            Comment.create({
                body: req.body.comment, 
                belongs_to: req.params.article_id, 
                created_by: req.body.user
            })
            .then(comment => {
                res.status(201)
                res.send(comment)
            })
            .catch(next)
        }
        // else user.find({username: defaultUser}).then...
    },
    vote (req, res, next) {
        const num = req.query.vote === 'up' ? 1 : req.query.vote === 'down' ? -1 : 0
        const resStatus = num ? 201 : 200;
        Article.findByIdAndUpdate({'_id':`${req.params.article_id}`}, {$inc:{'votes': num} }, {new: true})
            .then(article => {
                res.status(resStatus)
                res.send(article)
            })
            .catch(next)
    }
}