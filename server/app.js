const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const roomRoutes = require('./api/routes/rooms');
const messagesRoutes = require('./api/routes/messages');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://admin:'
+process.env.MONGO_DB_PASSWORD+
'@cluster0.axmp4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//for cors errors
app.use((req, res, next) => {
    res.header('Acess-Control-Allow-Origin', '*');
    res.header('Acess-Control-Allow-Headers', 'Origin, X-Requsted-With',
    "Content-Type, Accept, Authorization");

    if(req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH', 
        'DELETE, GET');
        return res.status(200).json({});
    }
    next();

})

//Routes that will handle http requests.
app.use('/users', userRoutes);
app.use('/rooms', roomRoutes);
app.use('/messages', messagesRoutes);


// error handling for bad requests.
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;