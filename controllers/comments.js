const {Article, Comment, User} = require('../models')

module.exports = {
    vote (req, res, next) {
        const num = req.query.vote === 'up' ? 1 : req.query.vote === 'down' ? -1 : 0
        const resStatus = num ? 201 : 200;
        Comment.findByIdAndUpdate({'_id':`${req.params.comment_id}`}, {$inc:{'votes': num} }, {new: true})
            .then(comment => {
                res.status(resStatus)
                res.send(comment)
            })
            .catch(next)
    },
    delete (req, res, next) {
        Comment.findByIdAndRemove(`${req.params.comment_id}`/*, {rawResult: true}*/)
            .then(comment => {
                res.status(202)
                res.send(comment)
            })
    }
}