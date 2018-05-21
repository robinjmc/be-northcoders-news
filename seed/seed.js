const mongoose = require('mongoose');
const {Article, Comment, Topic, User} = require('../models')

module.exports = {
    seedDB(articlesData, commentsData, topicsData, usersData) {
    return mongoose.connection.dropDatabase()
        .then(() => {
            return Promise.all([Topic.insertMany(topicsData), User.insertMany(usersData)])
        })
        .then(([topicDocs, userDocs]) => {
            articlesData.map(article => {
                let topic = topicDocs.find(function(ele) {
                    return ele.slug === article.topic
                })
                
                let user = userDocs.find(function(ele) {
                    return ele.username === article.created_by
                })
                
                article.belongs_to = topic._id
                article.created_by = user._id
            })
           
            return Promise.all([topicDocs, userDocs, Article.insertMany(articlesData)])
        })
        .then(([topicDocs, userDocs, articleDocs]) => {
            commentsData.map(comment => {
                let article = articleDocs.find(function (ele) {
                    return ele.title === comment.belongs_to
                })
                
                let user = userDocs.find(function(ele) {
                    return ele.username === comment.created_by
                })
                comment.belongs_to = article._id
                comment.created_by = user._id
            })
            return Promise.all([topicDocs, userDocs, articleDocs, Comment.insertMany(commentsData)])
        })
        .then(data => {
            console.log('database seeded!')
            return data
        })
    }
}