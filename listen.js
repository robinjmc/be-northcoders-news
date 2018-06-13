const app = require('./app')
const PORT = process.env.PORT || 3000;
console.log(PORT)

app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}`)
})