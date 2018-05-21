process.env.NODE_ENV='test';

const app = require('../app');
const request = require('supertest')(app);
const {articlesData, commentsData, topicsData, usersData} = require('../seed/testData')
const {seedDB} = require('../seed/seed');
const mongoose = require('mongoose');


describe('API', function () {
    let articleDocs, commentDocs, topicDocs, userDocs
    beforeEach(function () {
        this.timeout(6000)
        return seedDB(articlesData, commentsData, topicsData, usersData)
        .then(data => {
           [articleDocs, commentDocs, topicDocs, userDocs] = data
        })
    })

    describe('', () => {
        it('', () => {
            console.log(articleDocs[0]._id)

        })
    })

    after(() => {
        mongoose.disconnect();
    })
})

