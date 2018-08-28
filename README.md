# NC NEWS Back End
A REST-ful API serving data. Organised into Users, Topics, Articles & Comments.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Node.js
download Node by following the installtion steps on their website (https://nodejs.org/en/)

MongoDB
download the mongo database by following the installtion steps on their website (https://www.mongodb.com)

### Installing

# Npm install
CD into the project folder and in the command line run $npm install or $npm i

# Config
Create a mongo collection for use in development

Create a config folder that includes a config.dev.js and a index.js file

Config.dev.js should include: module.exports = {DB_URL:'mongodb://localhost:$'PORT_NUMBER'/'COLLECTION_NAME''}

'PORT_NUMBER' Is the number your mongodb is running on locally

'COLLECTION_NAME' Is the name you gave to the mongoDB collection you are using for development

Index.js should include: module.exports = require(`./config.${process.env.NODE_ENV}.js`);

# Seed Development Database
In the command line run: $npm dev run seed

#Run Locally
To run locally with nodemon in the browser run in the command line: $npm run dev
Without nodemon: $npm run start

## Running the tests

# Config
Create a mongo collection for use in testing

In the config folder create a file called config.test.js

Config.test.js should include: module.exports = {DB_URL:'mongodb://localhost:$'PORT_NUMBER'/'COLLECTION_NAME_TEST''}

'PORT_NUMBER' Is the number your mongodb is running on locally

'COLLECTION_NAME_TEST' Is the name you gave to the mongoDB collection you are using for testing

# Running the tests
In the command line run: $npm run test

### Endpoints

``` http
GET /
```

Serves an HTML page with documentation for all the available endpoints

``` http
GET /api/topics/
```

Get all the topics

``` http
GET /api/topics/:topic_id/articles
```

Return all the articles for a certain topic

``` http
POST /api/topics/:topic_id/articles
```

Add a new article to a topic. This route requires a JSON body with title and body key value pairs
e.g: `{ "title": "this is my new article title", "body": "This is my new article content"}`

``` http
GET /api/articles
```

Returns all the articles

``` http
GET /api/articles/:article_id
```

Get an individual article

``` http
GET /api/articles/:article_id/comments
```

Get all the comments for a individual article

``` http
POST /api/articles/:article_id/comments
```

Add a new comment to an article. This route requires a JSON body with a comment key and value pair
e.g: `{"comment": "This is my new comment"}`

``` http
PUT /api/articles/:article_id
```

Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/articles/:article_id?vote=up`

``` http
PUT /api/comments/:comment_id
```

Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/comments/:comment_id?vote=down`

``` http
DELETE /api/comments/:comment_id
```

Deletes a comment

``` http
GET /api/users/:username
```

Returns a JSON object with the profile data for the specified user.

