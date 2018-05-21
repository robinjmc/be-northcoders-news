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
                const userID = userDocs.find(user => {
                    //console.log(user.username)
                    //console.log(article.created_by)
                    return user.username === article.created_by
                })._id

                return {...article, belongs_to: topicID, created_by: userID}
               /* article.belongs_to = topicID
                article.created_by = userID

                return article*/
            })
            return Promise.all([topicDocs, userDocs, Article.insertMany(articles)])
        })
        .then(([topicDocs, userDocs, articleDocs]) => {
           const comments =  commentsData.map(comment => {
                const articleID = articleDocs.find(article => article.title === comment.belongs_to)._id
                const userID = userDocs.find(user => user.username === comment.created_by)._id

                return {...comment, belongs_to: articleID, created_by: userID}
                /*comment.belongs_to = articleID
                comment.created_by = userID
                return comment*/
            })
            return Promise.all([topicDocs, userDocs, articleDocs, Comment.insertMany(comments)])
        })
        .then(data => {
            console.log('database seeded!')
            return data
        })
        .catch(console.log)
    }
}