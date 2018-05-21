const {User} = require('../models')

module.exports = {
    getUser (req, res, next){
        console.log(req.params)
        User.findOne(req.params)
        .then(user => {
            console.log(user)
            res.send(user)
        })
        .catch(next)
    }
}