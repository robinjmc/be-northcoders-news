process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';

const mongoose = require('mongoose')
const app = require('express')();
const {json} = require('body-parser')
const DB_URL = process.env.DB_URL || require('./config').DB_URL
const api = require('./routes/api')

mongoose.connect(DB_URL)
    .then(() => {
        console.log(`connected to ${process.env.NODE_ENV} DB_URL`)
    })

app.use(json());

app.use('/api', api);

app.use((err, req, res, next) => {
    console.log('in next block')
    console.log(JSON.stringify(err, null, 2))
    //CastError err.name validationError === 400
    //CastError is for invalid ObjectId ValidationError is when the data doesnt match the schema
    if(err.name === 'CastError' || err.name === 'ValidationError') return res.status(400).send({message: 'Bad Request'});
    if(err.status === 404 || err.status === 501 || err.name === 'TypeError') return res.status(err.status).send({message: 'Not Found'});
    next();
})

app.use((err, req, res, next) => {
    return res.status(500).send({message: 'Server Error'});
})

module.exports = app;