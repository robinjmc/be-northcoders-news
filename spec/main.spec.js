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
        this.timeout(10000)
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
            .then(({body:{topics}}) => {
                expect(topics).to.have.lengthOf(2)
                expect(topics[0].title).to.equal('Mitch')
                expect(topics[1]._id).to.equal(`${topicDocs[1]._id}`)
            })
        })
        it('GET /topics/:topic/articles', () => {
            return request
            .get('/api/topics/cats/articles')
            .expect(200)
            .then(res => {            
                expect(res.body).to.have.lengthOf(2)
                expect(res.body[0].belongs_to).to.equal(`${topicDocs[1]._id}`)
                expect(res.body[1].belongs_to).to.equal(`${topicDocs[1]._id}`)
            })

        })
    })
    describe('/articles', () => {
            it('GET /articles', () => {
                return request
                .get('/api/articles')
                .expect(200)    
                .then(res => {
                    expect(res.body.articles).to.have.lengthOf(4)
                    expect(res.body.articles[2].created_by).to.equal(`${userDocs[0]._id}`)
                    expect(res.body.articles[1].belongs_to).to.equal(`${topicDocs[0]._id}`)
                })

            })
            it('GET /articles/:article_id/comments', () => {
                return request
                .get(`/api/articles/${articleDocs[0]._id}/comments`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.lengthOf(2)
                    expect(res.body[1].body).to.equal('The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.')
                    expect(res.body[0].belongs_to).to.equal(`${articleDocs[0]._id}`)
                })
            })
            it('POST /articles/:article_id/comments w/existing user', () => {
                return request
                .post(`/api/articles//${articleDocs[0]._id}/comments`)
                .send({
                    'comment': 'foo',
                    'user': `${userDocs[0]._id}`
                })
                .expect(201)
                .then(({body}) => {
                    expect(body.created_by).to.equal(`${userDocs[0]._id}`)
                    expect(body.body).to.equal('foo')
                    
                })
            })
            it.only('POST /articles/:article_id/comments w/anon user', () => {
                return request
                .post(`/api/articles//${articleDocs[0]._id}/comments`)
                .send({
                    'comment': 'bar'
                })
                .expect(201)
                .then(({body}) => {
                    expect(body.body).to.equal('bar')
                })
            })
            it('PUT /articles/:article_id Increment vote', () => {
                return request
                .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
                .expect(201)
                .then(({body}) => {
                    expect(body.votes).to.equal(1)
                })
            })
            it('PUT /articles/:article_id Decrement vote', () => {
                return request
                .put(`/api/articles/${articleDocs[1]._id}?vote=down`)
                .expect(201)
                .then(({body}) => {
                    expect(body.votes).to.equal(articleDocs[1].votes -1)
                })
            })
            it('ignores incorrect query', () => {
                return request
                .put(`/api/articles/${articleDocs[1]._id}?vote=down`)
                .expect(201)
                .then(({body}) => {
                    return request
                    .put(`/api/articles/${articleDocs[1]._id}?vote=bananas`)
                    .expect(200)
                    .then(({body}) => {
                        expect(body.votes).to.equal(articleDocs[1].votes -1)
                    })
                })
                
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
    describe('/comments', () => {
        it('PUT /comments/:comment_id Increment vote', () => {
            return request
            .put(`/api/comments/${commentDocs[0]._id}?vote=up`)
            .expect(201)
            .then(({body}) => {
                expect(body.votes).to.equal(commentDocs[0].votes + 1)
            })
        })
        it('PUT /comments/:comment_id Decrement vote', () => {
            return request
            .put(`/api/comments/${commentDocs[0]._id}?vote=down`)
            .expect(201)
            .then(({body}) => {
                expect(body.votes).to.equal(commentDocs[0].votes - 1)
            })
        })
        it('ignores incorrect query', () => {
            return request
            .put(`/api/comments/${commentDocs[1]._id}?vote=down`)
            .expect(201)
            .then(({body}) => {
                return request
                .put(`/api/comments/${commentDocs[1]._id}?vote=bananas`)
                .expect(200)
                .then(({body}) => {
                    expect(body.votes).to.equal(commentDocs[1].votes -1)
                })
            })
            
        })
        it('DELETE /comments/:comment_id', () => {
            return request
            .post(`/api/articles//${articleDocs[0]._id}/comments`)
            .send({
                'comment': 'foobar',
                'user': `${userDocs[0]._id}`
            })
            .expect(201)
            .then(({body}) => {
                expect(body.created_by).to.equal(`${userDocs[0]._id}`)
                return request
                .delete(`/api/comments/${body._id}`)
                .expect(202)
                .then(({body}) => {
                    console.log(body)
                    expect(body.body).to.equal('foobar')
                })
            })
        })
    })
    after(() => {
        mongoose.disconnect();
    })
})

