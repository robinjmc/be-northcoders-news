const {User} = require('../models')

module.exports = {
    getUser (req, res, next){
        User.findOne(req.params)
        .then(user => res.send(user))
        .catch(next)
    }
    //create new user function
}