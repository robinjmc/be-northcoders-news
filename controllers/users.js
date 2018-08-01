const { User } = require('../models')

exports.getUser = (req, res, next) => {
    User.findById(req.params.user_id)
        .then(user => {
            if (!user) throw { status: 404 }
            res.send(user)
        })
        .catch(next)
}

exports.getAll = (req, res, next) => {
    User.find()
        .then(users => res.send({ users }))
        .catch(next)
}
