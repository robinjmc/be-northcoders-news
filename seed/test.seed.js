/*const mongoose = require('mongoose');
const {seedDB} = require('./seed')
const {articlesData, commentsData, topicsData, usersData} = require('./testData')

mongoose.connect('mongodb://localhost:27017/nc_news_test')
    .then(() => {
        return seedDB(articlesData, commentsData, topicsData, usersData)
    })
    .then(() => {
        return mongoose.disconnect()
    })
    .catch(console.log)
*/