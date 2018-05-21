const mongoose = require('mongoose');
const {Article, Commment, Topic, User} = require('../models')

module.exports = {
    seedDB(articlesData, commentsData, topicsData, usersData) {
    return mongoose.connection.dropDatabase()
        .then(() => {
            return Promise.all([Topic.insertMany(topicsData), User.insertMany(usersData)])
        })
        .then(([topicDocs, userDocs]) => {

            console.log(topicDocs)

        
            return Promise.all(topicDocs, userDocs, Article.insertMany(articlesData))
        })
        .then(([topicDocs, userDocs, articleDocs]) => {
            return Comment.insertMany(commentsData)
        })
    }
}