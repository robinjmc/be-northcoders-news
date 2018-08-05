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
        it('GET /topics', () => {
            return request
                .get('/api/topics')
                .expect(200)
                .then(({ body: { topics } }) => {
                    expect(topics).to.have.lengthOf(topicDocs.length)
                    expect(topics[0].title).to.equal(topicDocs[0].title)
                    expect(topics[1]._id).to.equal(`${topicDocs[1]._id}`)
                })
        })
        it('GET /topics/:topic_id/articles', () => {
            return request
                .get(`/api/topics/${topicDocs[1]._id}/articles`)
                .expect(200)
                .then(({ body }) => {
                    expect(body).to.have.lengthOf(2)
                    expect(body[0].belongs_to).to.equal(`${topicDocs[1]._id}`)
                    expect(body[1].belongs_to).to.equal(`${topicDocs[1]._id}`)
                })
        })
        it('POST /topics/:topic_id/articles w/existing user', () => {
            let newArticle = {
                'title': 'this is my new article title',
                'body': 'This is my new article content',
                'user': `${userDocs[0]._id}`
            }
            return request
                .post(`/api/topics/${topicDocs[0]._id}/articles`)
                .send(newArticle)
                .expect(201)
                .then(({ body }) => {
                    expect(body.created_by).to.equal(`${newArticle.user}`)
                    expect(body.body).to.equal(newArticle.body)
                    expect(body.belongs_to).to.equal(`${topicDocs[0]._id}`)
                })
        })

    })
    describe('/articles', () => {
        it('GET /articles', () => {
            return request
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body).to.have.lengthOf(articleDocs.length)
                    expect(body[2].created_by).to.equal(`${userDocs[0]._id}`)
                    expect(body[1].belongs_to).to.equal(`${topicDocs[0]._id}`)
                    expect(body[0]).to.have.property('comment_count').that.is.a('number');
                })
        })
        it('GET /articles/article_id', () => {
            return request
                .get(`/api/articles/${articleDocs[0]._id}`)
                .expect(200)
                .then(({ body }) => {
                    expect(body._id).to.equal(`${articleDocs[0]._id}`)
                    expect(body.body).to.equal(articleDocs[0].body)
                })
        })
        it('GET /articles/:article_id/comments', () => {
            return request
                .get(`/api/articles/${articleDocs[0]._id}/comments`)
                .expect(200)
                .then(({ body }) => {
                    expect(body).to.have.lengthOf(2)
                    expect(body[0].body).to.equal(commentDocs[0].body)
                    expect(body[1].belongs_to).to.equal(`${articleDocs[0]._id}`)
                })
        })
        it('POST /articles/:article_id/comments w/existing user', () => {
            let newComment = {
                'comment': 'foo',
                'user': `${userDocs[0]._id}`
            }
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send(newComment)
                .expect(201)
                .then(({ body }) => {
                    expect(body.created_by).to.equal(`${userDocs[0]._id}`)
                    expect(body.body).to.equal(newComment.comment)
                    expect(body.belongs_to).to.equal(`${articleDocs[0]._id}`)
                })
        })
        it('POST /articles/:article_id/comments w/anon user', () => {
            let newComment = {
                'comment': 'bar'
            }
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send(newComment)
                .expect(201)
                .then(({ body }) => {
                    expect(body.body).to.equal(newComment.comment)
                    expect(body.belongs_to).to.equal(`${articleDocs[0]._id}`)
                })
        })
        it('PUT /articles/:article_id Increment vote', () => {
            return request
                .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
                .expect(201)
                .then(({ body }) => {
                    expect(body.body).to.equal(articleDocs[0].body)
                    expect(body.votes).to.equal(articleDocs[0].votes + 1)
                })
        })
        it('PUT /articles/:article_id Decrement vote', () => {
            return request
                .put(`/api/articles/${articleDocs[1]._id}?vote=down`)
                .expect(201)
                .then(({ body }) => {
                    expect(body.body).to.equal(articleDocs[1].body)
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
                    expect(body.users).to.have.lengthOf(userDocs.length)
                    expect(body.users[0]._id).to.equal(`${userDocs[0]._id}`)
                })
        })
        it('GET /users/:user_id', () => {
            return request
                .get(`/api/users/${userDocs[0]._id}`)
                .expect(200)
                .then(({ body }) => {
                    expect(body.username).to.equal(userDocs[0].username)
                    expect(body._id).to.equal(`${userDocs[0]._id}`)
                })
        })
    })
    describe('/comments', () => {
        it('PUT /comments/:comment_id Increment vote', () => {
            return request
                .put(`/api/comments/${commentDocs[0]._id}?vote=up`)
                .expect(201)
                .then(({ body }) => {
                    console.log(body)
                    expect(body.votes).to.equal(commentDocs[0].votes + 1)
                })
        })
        it('PUT /comments/:comment_id Decrement vote', () => {
            return request
                .put(`/api/comments/${commentDocs[0]._id}?vote=down`)
                .expect(201)
                .then(({ body }) => {
                    expect(body.votes).to.equal(commentDocs[0].votes - 1)
                })
        })
        it('DELETE /comments/:comment_id', () => {
            return request
                .delete(`/api/comments/${commentDocs[1]._id}`)
                .expect(202)
                .then(({ body }) => {
                    expect(body._id).to.equal(`${commentDocs[1]._id}`)
                    expect(body.belongs_to).to.equal(`${commentDocs[1].belongs_to}`)
                    expect(body.body).to.equal(commentDocs[1].body)
                })
        })
    })

    describe('Error handling', () => {
        describe('/topics', () => {
            it('GET /topics/:topic_id/articles', () => {
                return request
                    .get(`/api/topics/${commentDocs[0]._id}/articles`)
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Not Found')
                    })
            })
            it('GET /topics/sheep/articles', () => {
                return request
                    .get(`/api/topics/sheep/articles`)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })
            it('POST /topics/:topic_id/articles w/existing user', () => {
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
            it('POST /topics/sheep/articles w/existing user', () => {
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
            it('POST /articles/:article_id/comments non-exisiting article', () => {
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
            it('POST /articles/:article_id/comments non-exisiting article', () => {
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
            it('POST /articles/:article_id/comments non-formatted comment', () => {
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

            it.only('PUT ignores incorrect query', () => {
                return request
                    .put(`/api/articles/${articleDocs[1]._id}?vote=down`)
                    .expect(201)
                    .then(({ body }) => {
                        console.log(body)
                        return request
                            .put(`/api/articles/${articleDocs[1]._id}?vote=bananas`)
                            .expect(200)
                            .then(({ body }) => {
                                console.log(body)
                                expect(body.votes).to.equal(articleDocs[1].votes - 1)
                            })
                    })
            })
        })
        describe('/users', () => {
            it('GET /users/:user_id', () => {
                return request
                    .get(`/api/users/${articleDocs[0]._id}`)
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Not Found')
                    })
            })
            it('GET /users/:user_id', () => {
                return request
                    .get(`/api/users/steve`)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Bad Request')
                    })
            })
        })
        describe('/comments', () => {
            it.only('ignores incorrect increment query', () => {
                return request
                    .put(`/api/comments/${commentDocs[1]._id}?vote=down`)
                    .expect(201)
                    .then(({ body }) => {
                        console.log(body)
                        return request
                            .put(`/api/comments/${commentDocs[1]._id}?vote=bananas`)
                            .expect(200)
                            .then(({ body }) => {
                                console.log(body)
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
            it('throws correct error if comment_id does not exist', () => {
                return request
                    .delete(`/api/comments/${userDocs[0]._id}`)
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).to.equal('Not Found')
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

