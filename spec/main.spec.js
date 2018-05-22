process.env.NODE_ENV='test';

const app = require('../app');
const request = require('supertest')(app);
const expect = require('chai').expect;
const {articlesData, commentsData, topicsData, usersData} = require('../seed/testData')
const {seedDB} = require('../seed/seed');
const mongoose = require('mongoose');


describe('API', function () {
    let articleDocs, commentDocs, topicDocs, userDocs
    beforeEach(function () {
        this.timeout(6000)
        return seedDB(articlesData, commentsData, topicsData, usersData)
        .then(({topics, users, articles, comments}) => {
           articleDocs = articles
           commentDocs = comments
           topicDocs = topics
           userDocs = users
        })
    })

    describe('/topics', () => {
        it('GET /topics', () => {
            return request
            .get('/api/topics')
            .expect(200)    
            .then(res => {
                expect(res.body.topics.length).to.equal(2)
            })
        })
        it('GET /topics/:topic/articles', () => {
            return request
            .get('/api/topics/cats/articles')
            .expect(200)
            .then(res => expect(res.body.length).to.equal(2))
        })
    })
    describe('/articles', () => {
            it('GET /articles', () => {
                return request
                .get('/api/articles')
                .expect(200)    
                .then(res => expect(res.body.articles.length).to.equal(4))
            })
        it('GET /topics/:article_id/comments', () => {
                return request
                .get(`/api/articles/${articleDocs[0]._id}/comments`)
                .expect(200)
                .then(res => expect(res.body.length).to.equal(2)
                )
            })
        })
    describe('/users', () => {
        it('GET /users/:username', () => {
            return request
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(res => expect(res.body.username).to.equal('butter_bridge'))
        })
    })
    after(() => {
        mongoose.disconnect();
    })
})

