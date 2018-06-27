const {Article, Comment, User} = require('../models')

module.exports = {
    vote (req, res, next) {
        const num = req.query.vote === 'up' ? 1 : req.query.vote === 'down' ? -1 : 0
        const resStatus = num ? 201 : 200;
        Comment.findByIdAndUpdate({'_id':`${req.params.comment_id}`}, {$inc:{'votes': num} }, {new: true})
            .then(comment => {
                if (!comment) throw { status: 404 }
                res.status(resStatus).send(comment)
            })
            .catch(next)
    },
    delete (req, res, next) {
        Comment.findByIdAndRemove(`${req.params.comment_id}`)
            .then(comment => {
                if (!comment) throw { status: 404 }
                res.status(202).send(comment)
            })
            .catch(next)
    }
}