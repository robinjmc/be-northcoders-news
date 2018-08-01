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