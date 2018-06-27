const {User} = require('../models')

module.exports = {
    getUser (req, res, next){
        User.findById(req.params.user_id)
            .then(user => {
                if (!user) throw { status: 404 }
                res.send(user)
            })
            .catch(next)
        // User.findOne(req.params)
        // .then(user => res.send(user))
        // .catch(next)
    }
}