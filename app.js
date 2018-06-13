process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';

const mongoose = require('mongoose')
const app = require('express')();
const {json} = require('body-parser')
const {DB_URL} = require('./config') || process.env ;
console.log(DB_URL)
const api = require('./routes/api')

mongoose.connect(DB_URL)
    .then(() => {
        console.log(`connected to ${process.env.NODE_ENV} DB_URL`)
    })

app.use(json());

app.use('/api', api);

app.use((err, req, res, next) => {
    if(err.status === 404 || err.status === 501) return res.status(err.status).send(err);
    next();
})

app.use((err, req, res, next) => {
    return res.status(500).send({message: 'Server Error'});
})

module.exports = app;