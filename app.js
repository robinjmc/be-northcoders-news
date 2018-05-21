if (process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'dev';

const express = require('express');
const app = express();
const {json} = require('body-parser')
const {DB_URL} = require(`./config`) 
const mongoose = require('mongoose')

mongoose.connect(DB_URL)
    .then(() => {
        console.log(`connected to ${process.env.NODE_ENV} DB_URL`)
    })
//do I need to make a db/config folder

module.exports = app;