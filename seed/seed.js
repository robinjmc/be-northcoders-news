const mongoose = require('mongoose');
const {Article, Comment, Topic, User} = require('../models')

module.exports = {
    seedDB(articlesData, commentsData, topicsData, usersData) {
    return mongoose.connection.dropDatabase()
        .then(() => {
            console.log('heeee')
            return Promise.all([Topic.insertMany(topicsData), User.insertMany(usersData)])
        })
        .then(([topicDocs, userDocs]) => {
            const articles = articlesData.map(article => {
                const topic = topicDocs.find(topic => {
                    return topic.slug === article.topic
                })
                
                let user = userDocs.find(function(ele) {
                    return ele.username === article.created_by
                })
                
                article.belongs_to = topic._id
                article.created_by = user._id
                return article
            })
           
            return Promise.all([topicDocs, userDocs, Article.insertMany(articles)])
        })
        .then(([topicDocs, userDocs, articleDocs]) => {
           const comments =  commentsData.map(comment => {
                const articleID = articleDocs.find(article => article.title === comment.belongs_to)._id
                
                let user = userDocs.find(function(user) {
                    return user.username === comment.created_by
                })
                comment.belongs_to = articleID
                comment.created_by = user._id
                return comment
            })
            return Promise.all([topicDocs, userDocs, articleDocs, Comment.insertMany(comments)])
        })
        .then(data => {
            
            console.log('database seeded!')
            return data
        }).catch(console.log)
    }
}