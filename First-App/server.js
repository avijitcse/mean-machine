//load the Express package and create app
var express = require('express'),
app = express();
var path = require('path');
//adds mongoosejs so we can connect to mongodb
var mongoose = require('mongoose');
//connect to mongo database
mongoose.connect('mongodb://localhost/db_name')

//send index.html to the user for the homepage
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

//login form
app.route('/login')

    //show the form (GET http://localhost:1337/login)
    .get(function(req, res){
        res.send('This is the login form');
    })

    //process the form (POST http://localhost:1337/login)
    .post(function(req, res){
        console.log('processing...');
        res.send('Processing the login form!');
    });

//create routes for the admin section:

//get an instance of the router
var adminRouter = express.Router();

//route middleware that will happen on every request
adminRouter.use(function(req, res, next){

    //log each request to the console
    console.log(req.method, req.url);

    //continue what we were doing and go to the route
    next();
});

//admin main page - the dashboard (http://localhost:1337/admin)
adminRouter.get('/', function(req, res){
    res.send('I am the dashboard! haHA!');
});

//users page (http:localhost:1337/admin/users)
adminRouter.get('/users', function(req, res){
    res.send('I show all the users!');
});

//route middleware to validate :name
adminRouter.param('name', function(req, res, next, name){
    //name validation here
    console.log('doing name validation on ' + name);

    //once the validation is done save the new item in the req
    req.name=name;
    //go to the next item
    next();
});

//route with parameters
adminRouter.get('/users/:name', function(req, res){
    res.send('hello ' + req.params.name + '!');
});

//posts page (http://localhost:1337/admin/posts)
adminRouter.get('/posts', function(req, res){
    res.send('I show all the posts!');
});

//apply the routes to our app
app.use('/admin', adminRouter);

//start server
app.listen(1337);
console.log('1337 is the magicalest port!');
