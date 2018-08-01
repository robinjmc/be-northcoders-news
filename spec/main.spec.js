process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest')(app);
const expect = require('chai').expect;
const { articlesData, commentsData, topicsData, usersData } = require('../seed/testData')
const { seedDB } = require('../seed/seed');
const mongoose = require('mongoose');


describe('API', function () {
    let articleDocs, commentDocs, topicDocs, userDocs
    beforeEach(function () {
        this.timeout(15000)
        return seedDB(articlesData, commentsData, topicsData, usersData)
            .then(({ topics, users, articles, comments }) => {
                articleDocs = articles
                commentDocs = comments
                topicDocs = topics
                userDocs = users
            })
    })

    after(() => {
        mongoose.disconnect();
    })
    
    describe('/topics', () => {
        it('GET /topics', () => { //Get all the topics
            return request
                .get('/api/topics')
                .expect(200)
                .then(({ body: { topics } }) => {
                    expect(topics).to.have.lengthOf(2)
                    expect(topics[0].title).to.equal('Mitch')
                    expect(topics[1]._id).to.equal(`${topicDocs[1]._id}`)
                })
        })
        it('GET /topics/:topic_id/articles', () => { //Return all the articles for a certain topic
            return request
                .get(`/api/topics/${topicDocs[1]._id}/articles`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.lengthOf(2)
                    expect(res.body[0].belongs_to).to.equal(`${topicDocs[1]._id}`)
                    expect(res.body[1].belongs_to).to.equal(`${topicDocs[1]._id}`)
                })
        })
        it('POST /topics/:topic_id/articles w/existing user', () => { //Add a new article to a topic.
            return request
                .post(`/api/topics/${topicDocs[0]._id}/articles`)
                .send({
                    'title': 'this is my new article title',
                    'body': 'This is my new article content',
                    'user': `${userDocs[0]._id}`
                })
                .expect(201)
                .then(({ body }) => {
                    expect(body.created_by).to.equal(`${userDocs[0]._id}`)
                    expect(body.body).to.equal('This is my new article content')
                })
        })
        
    })
    describe('/articles', () => {
        it('GET /articles', () => { //Returns all the articles & their indivdual comment count
            return request
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body).to.have.lengthOf(4)
                    expect(body[2].created_by).to.equal(`${userDocs[0]._id}`)
                    expect(body[1].belongs_to).to.equal(`${topicDocs[0]._id}`)
                    expect(body[0].comment_count).to.equal(2)
                })
        })
        it('GET /articles/article_id', () => {//Get an individual article
            return request
                .get(`/api/articles/${articleDocs[0]._id}`)
                .expect(200)
                .then(({ body }) => {
                    expect(body._id).to.equal(`${articleDocs[0]._id}`)
                    expect(body.body).to.equal('I find this existence challenging')
                })
        })
        it('GET /articles/:article_id/comments', () => { //Get all the comments for a individual article
            return request
                .get(`/api/articles/${articleDocs[0]._id}/comments`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.lengthOf(2)
                    expect(res.body[1].body).to.equal('The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.')
                    expect(res.body[0].belongs_to).to.equal(`${articleDocs[0]._id}`)
                })
        })
        it('POST /articles/:article_id/comments w/existing user', () => { //Add a new comment to an article.
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send({
                    'comment': 'foo',
                    'user': `${userDocs[0]._id}`
                })
                .expect(201)
                .then(({ body }) => {
                    expect(body.created_by).to.equal(`${userDocs[0]._id}`)
                    expect(body.body).to.equal('foo')

                })
        })
        it('POST /articles/:article_id/comments w/anon user', () => { //Add a new comment to an article.
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send({
                    'comment': 'bar'
                })
                .expect(201)
                .then(({ body }) => {
                    expect(body.body).to.equal('bar')
                })
        })
        it('PUT /articles/:article_id Increment vote', () => { //Increment or Decrement the votes of an article by one.
            return request
                .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
                .expect(201)
                .then(({ body }) => {
                    expect(body.votes).to.equal(1)
                })
        })
        it('PUT /articles/:article_id Decrement vote', () => {//Increment or Decrement the votes of an article by one.
            return request
                .put(`/api/articles/${articleDocs[1]._id}?vote=down`)
                .expect(201)
                .then(({ body }) => {
                    expect(body.votes).to.equal(articleDocs[1].votes - 1)
                })
        })
    })
    describe('/users', () => {
        it('Get /users/', () => {
            return request
                .get('/api/users/')
                .expect(200)
                .then(({ body }) => {
                    expect(body.users).to.have.lengthOf(2)
                    expect(body.users[0]._id).to.equal(`${userDocs[0]._id}`)
                })
        })
        it('GET /users/:user_id', () => { //Returns a JSON object with the profile data for the specified user
            return request
                .get(`/api/users/${userDocs[0]._id}`)
                .expect(200)
                .then(({ body }) => {
                    expect(body.username).to.equal('butter_bridge')
                    expect(body._id).to.equal(`${userDocs[0]._id}`)
                })
        })
    })
    describe('/comments', () => {
        it('PUT /comments/:comment_id Increment vote', () => { //Increment or Decrement the votes of a comment by one.
            return request
                .put(`/api/comments/${commentDocs[0]._id}?vote=up`)
                .expect(201)
                .then(({ body }) => {
                    expect(body.votes).to.equal(commentDocs[0].votes + 1)
                })
        })
        it('PUT /comments/:comment_id Decrement vote', () => { //Increment or Decrement the votes of a comment by one.
            return request
                .put(`/api/comments/${commentDocs[0]._id}?vote=down`)
                .expect(201)
                .then(({ body }) => {
                    expect(body.votes).to.equal(commentDocs[0].votes - 1)
                })
        })
        it('DELETE /comments/:comment_id', () => { //Deletes a comment
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send({
                    'comment': 'foobar',
                    'user': `${userDocs[0]._id}`
                })
                .expect(201)
                .then(({ body }) => {
                    expect(body.created_by).to.equal(`${userDocs[0]._id}`)
                    return request
                        .delete(`/api/comments/${body._id}`)
                        .expect(202)
                        .then(({ body }) => {
                            expect(body.body).to.equal('foobar')
                        })
                })
        })
    })

    describe('Error handling', () => {
        describe('/topics', () => {
            it('GET /topics/:topic_id/articles', () => { //Return correct error for non-existant topic
                return request
                    .get(`/api/topics/${commentDocs[0]._id}/articles`)
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Not Found')
                    })
            })
            it('GET /topics/sheep/articles', () => { //Return correct error for ncorrectly structured id
                return request
                    .get(`/api/topics/sheep/articles`)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })
            it('POST /topics/:topic_id/articles w/existing user', () => { //Return correct error for non-existant topic
                return request
                    .post(`/api/topics/${commentDocs[0]._id}/articles`)
                    .send({
                        'title': 'this is my new article title',
                        'body': 'This is my new article content',
                        'user': `${userDocs[0]._id}`
                    })
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Not Found')
                    })
            })
            it('POST /topics/sheep/articles w/existing user', () => { //Return correct error for incorrectly structured id
                return request
                    .post(`/api/topics/sheep/articles`)
                    .send({
                        'title': 'this is my new article title',
                        'body': 'This is my new article content',
                        'user': `${userDocs[0]._id}`
                    })
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })
            it('POST /topics/:topic_id/articles w/out user id', () => {
                return request
                    .post(`/api/topics/${topicDocs[0]._id}/articles`)
                    .send({
                        'title': 'this is my new article title by anon',
                        'body': 'This is my new article content by anon'
                    })
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })
        })
        describe('/articles', () => {
            //getting non-exisiting article
            it('get articles/foo', () => {
                return request
                    .get('/api/articles/foo')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })
            it('get articles/comment_id', () => {
                return request
                    .get(`/api/articles/${commentDocs[0]._id}`)
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Not Found')
                    })
            })
            it('get articles/comment_id/comments', () => {
                return request
                    .get(`/api/articles/${commentDocs[0]._id}/comments`)
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Not Found')
                    })
            })
            it('get articles/bar/comments', () => {
                return request
                    .get(`/api/articles/bar/comments`)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })
            it('POST /articles/:article_id/comments non-exisiting article', () => { //Return correct error for non-existant article
                return request
                    .post(`/api/articles/${commentDocs[0]._id}/comments`)
                    .send({
                        'comment': 'foobarfoo'
                    })
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Not Found')
                    })
            })
            it('POST /articles/:article_id/comments non-exisiting article', () => { //Return correct error for non-existant article
                return request
                    .post(`/api/articles/mouse/comments`)
                    .send({
                        'comment': 'foobarfoo'
                    })
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })
            it('POST /articles/:article_id/comments non-formatted comment', () => { //returns correct error for wrongly formatted post request
                return request
                    .post(`/api/articles/${articleDocs[0]._id}/comments`)
                    .send({
                        'body': 'barfoobarfoo'
                    })
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })

            it('PUT ignores incorrect query', () => { //ignores incorrect increment query
                return request
                    .put(`/api/articles/${articleDocs[1]._id}?vote=down`)
                    .expect(201)
                    .then(({ body }) => {
                        return request
                            .put(`/api/articles/${articleDocs[1]._id}?vote=bananas`)
                            .expect(200)
                            .then(({ body }) => {
                                expect(body.votes).to.equal(articleDocs[1].votes - 1)
                            })
                    })

            })
        })
        describe('/users', () => {
            it('GET /users/:user_id', () => { //throws correct error if user not found/invalid user_id
                return request
                    .get(`/api/users/${articleDocs[0]._id}`)
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Not Found')
                    })
            })
            it('GET /users/:user_id', () => { //throws correct error if user not formatted properly
                return request
                    .get(`/api/users/steve`)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })
        })
        describe('/comments', () => {
            it('ignores incorrect increment query', () => { //ignores incorrect increment query
                return request
                    .put(`/api/comments/${commentDocs[1]._id}?vote=down`)
                    .expect(201)
                    .then(({ body }) => {
                        return request
                            .put(`/api/comments/${commentDocs[1]._id}?vote=bananas`)
                            .expect(200)
                            .then(({ body }) => {
                                expect(body.votes).to.equal(commentDocs[1].votes - 1)
                            })
                    })
            })
            it('throws correct error if comment_id does not exist', () => {
                return request
                    .put(`/api/comments/${articleDocs[1]._id}?vote=down`)
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Not Found')
                    })
            })
            it('throws correct error if comment_id is not formatted correctly', () => {
                return request
                    .put(`/api/comments/sheep?vote=down`)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })
            it('throws correct error if comment_id does not exist', () => {//throws correct error if comment_id does not exist
                return request
                    .post(`/api/articles/${articleDocs[0]._id}/comments`)
                    .send({
                        'comment': 'foobar',
                        'user': `${userDocs[0]._id}`
                    })
                    .expect(201)
                    .then(({ body }) => {
                        expect(body.created_by).to.equal(`${userDocs[0]._id}`)
                        return request
                            .delete(`/api/comments/${userDocs[0]._id}`)
                            .expect(404)
                            .then(({ body }) => {
                                expect(body.message).to.equal('Not Found')
                            })
                    })
            })
            it('throws correct error if comment_id is not formatted correctly', () => {//throws correct error if comment_id is not formatted correctly
                return request
                    .delete(`/api/comments/troll`)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })

        })
    })
})

