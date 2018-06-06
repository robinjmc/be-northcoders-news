# NCN backend checklist
- [ ] README clear and instructions accurate
- [ ]  Needs instructions to seed database
- [ ] Package.json includes dependencies (mocha in particular) organised into dev and not dev
- [ ] Node modules ignored
- [ ] Seed function relies on data and DBURL passed to it not global variables
- [ ] Routes broken down with `Router.route`
- [ ] Uses config file and process.env
- [ ] No errors in the console
- [ ] Deployed on heroku and Mlab

## implements all endpoints
- [ ] `GET /api/topics`
- [ ] `GET /api/topics/:topic_id/articles` (should calculate comment count in controller)
- [ ] `GET /api/articles`  (should calculate comment count in controller)
- [ ] `GET /api/articles/:article_id`
- [ ] `GET /api/articles/:article_id/comments`
- [ ] `POST /api/articles/:article_id/comments`
- [ ] `PUT /api/articles/:article_id`
- [ ] `PUT /api/comments/:comment_id`
- [ ] `DELETE /api/comments/:comment_id`
- [ ]  `GET /api/users/:username`
- [ ] Error handling on server (cast error, 400 and 500)
- [ ] Error handling on controllers
- [ ] 404 on invalid routes.

## Testing 
- [ ] Tests use test environment and DB
- [ ] Tests run successfully and are explicit: no just testing the length of things
- [ ] Tests are promisified and describe_it blocks organised_logically
- [ ] Tests all endpoints
- [ ] Tests against `usefulData`
- [ ] Tests 400 and 404 errors