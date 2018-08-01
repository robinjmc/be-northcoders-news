const { Article, Comment, User } = require('../models')
// populate
exports.getAll = (req, res, next) => {
    Article.find().lean()
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
                return article
            })
            res.send(articlesAndComments)
        })
        .catch(next)
}
exports.getByID = (req, res, next) => {
    Article.findById(req.params.article_id)
        .then(article => {
            if (!article) throw { status: 404 }
            res.send(article)
        })
        .catch(next)
}
exports.getComments = (req, res, next) => {
    Comment.find({ 'belongs_to': req.params.article_id })
        .then(comments => {
            if (!comments.length) throw { status: 404 }
            res.send(comments)
        })
        .catch(next)
}
exports.postComment = (req, res, next) => {
    Article.findById(req.params.article_id)
        .then(article => {
            if (!article) throw { status: 404 }
            const newUser = Math.random().toString(18).substring(9)
            return User.create({
                username: newUser,
                name: 'user' + newUser,
                avatar_url: 'http://standard.tj/img/general/avartar.jpg'
            })
        })
        .then(user => {
            let userID = req.body.hasOwnProperty('user') ? req.body.user : user._id
            return Comment.create({
                body: req.body.comment,
                belongs_to: req.params.article_id,
                created_by: userID
            })
        })
        .then(comment => res.status(201).send(comment))
        .catch(next)
}
exports.vote = (req, res, next) => {
    const num = req.query.vote === 'up' ? 1 : req.query.vote === 'down' ? -1 : 0
    const resStatus = num ? 201 : 200;
    Article.findByIdAndUpdate({ '_id': `${req.params.article_id}` }, { $inc: { 'votes': num } }, { new: true })
        .then(article => {
            res.status(resStatus)
            res.send(article)
        })
        .catch(next)
}
