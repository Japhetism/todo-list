const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if(!isProduction) {
    app.use(errorHandler());
}

//Configure Mongoose
const mongodb = 'mongodb://localhost/to-do';
mongoose.connect(mongodb, { useNewUrlParser: true , useUnifiedTopology: true,   useCreateIndex: true });
mongoose.set('debug', true);

//Models and routes
require('./models/users')
require('./config/passport');
app.use(require('./routes'));

//Success and Error handlers and middlewares
if(!isProduction) {
    app.use((err, req, res) => {
        res.status(err.status || 500);
        
        res.json({
            error: {
                status: err.status || 500,
                message: err.message,
                error: err,
            },
        });
    });

    app.use((success, req, res) => {
        res.status(success.status || 200) ;
        res.json({
            success: {
                status: succcess.status || 200,
                message: success.message,
                data: success
            }
        })
    })
}

app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        error: {
            status: err.status || 500,
            message: err.message,
            error: {},
        },
    });
});

app.use((success, req, res) => {
    res.status(success.status || 200) ;
    res.json({
        success: {
            status: succcess.status || 200,
            message: success.message,
            data: success
        }
    })
})

//JWT validation error handler
app.use((err, req, res, next) => {  
    console.log(err)
    if (err.name === 'UnauthorizedError') {  
        res.status(401).json({
            error: {
                status: 401,
                message: 'Unauthorized user',
                description: err.message
            },
        });  
    }
})


app.listen(4000, () => console.log('Server running on http://localhost:4000/'));