const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const todoRoute = require('./routes/to-do');
const app = express();
const port = 4000
const mongodb = 'mongodb://localhost/to-do';

mongoose.connect(mongodb, { userNewUrlParser: true });
const db = mongoose.connection;
db.on('error', () => {
    console.log("Soemthing went wrong to connect to database")
});
db.once('open', () => {
    console.log("DB connection has been made successfully");
})

//enable cors
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use('/', todoRoute)

app.listen(port, () => console.log(`Sample app listening on port ${port}`))
