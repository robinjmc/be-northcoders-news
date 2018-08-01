process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';

const mongoose = require('mongoose')
const express = require('express')
const app = express();
const {json} = require('body-parser')
const DB_URL = process.env.DB_URL || require('./config').DB_URL
const api = require('./routes/api')
const cors = require('cors')
// const path = require('path')


mongoose.connect(DB_URL)
    .then(() => {
        console.log(`connected to ${DB_URL}`)
    })


app.use(cors());

app.use(json());

app.use('/api', api);

app.use(express.static('./view'));

app.get('/',function(req,res){
    res.sendFile('index.html');
  });
  

app.use((err, req, res, next) => {
    if(err.name === 'CastError' || err.name === 'ValidationError') return res.status(400).send({message: 'Bad Request'});
    if(err.status === 404 || err.status === 501 ) return res.status(err.status).send({message: 'Not Found'});
    next();
})

app.use((err, req, res, next) => {
    return res.status(500).send({message: 'Server Error'});
})

module.exports = app;