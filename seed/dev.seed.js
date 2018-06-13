const mongoose = require('mongoose');
const {seedDB} = require('./seed')
const {articlesData, commentsData, topicsData, usersData} = require('./devData')
const {DB_URL} = require('../config')

mongoose.connect(DB_URL)
    .then(() => {
        return seedDB(articlesData, commentsData, topicsData, usersData)
    })
    .then(() => {
        return mongoose.disconnect()
    })
    .catch(console.log)

    //if test connect to nc_news_test else connect to nc_news
    //should I merge test and dev files so the connection to the database changes depending on whether its a test or not what is best practice