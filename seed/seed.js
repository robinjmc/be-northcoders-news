const mongoose = require('mongoose');
const {Article, Comment, Topic, User} = require('../models')

module.exports = {
    seedDB(articlesData, commentsData, topicsData, usersData) {
    return mongoose.connection.dropDatabase()
        .then(() => {
            return Promise.all([Topic.insertMany(topicsData), User.insertMany(usersData)])
        })
        .then(([topicDocs, userDocs]) => {
            const articles = articlesData.map(article => {
                const topicID = topicDocs.find(topic => topic.slug === article.topic)._id
                const userID = userDocs.find(user => user.username === article.created_by)._id
                return {...article, belongs_to: topicID, created_by: userID}
            })
            return Promise.all([topicDocs, userDocs, Article.insertMany(articles)])
        })
        .then(([topicDocs, userDocs, articleDocs]) => {
           const comments =  commentsData.map(comment => {
                const articleID = articleDocs.find(article => article.title === comment.belongs_to)._id
                const userID = userDocs.find(user => user.username === comment.created_by)._id
                return {...comment, belongs_to: articleID, created_by: userID}
            })
            return Promise.all([topicDocs, userDocs, articleDocs, Comment.insertMany(comments)])
        })
        .then(([topicDocs, userDocs, articleDocs, commentDocs]) => {
            return {
                topics: topicDocs,
                users: userDocs,
                articles: articleDocs,
                comments: commentDocs
            }
        })
        .catch(console.log)
    }
}