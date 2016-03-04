
// BASE SETUP
// ======================================

// • express is the Node framework.
// • morgan allows us to log all requests to the console so we can see exactly what is going on.
// • mongoose is the ODM we will use to communicate with our MongoDB database.
// • body-parser will let us pull POST content from our HTTP request so that we can do things
// like create a user.
// • bcrypt-nodejs will allow us to hash our passwords since it is never safe to store passwords
// plaintext in our databases

// CALL THE PACKAGES --------------------
var express = require('express');
var app = express(); //define app using express
var body-parser = require('body-parser'); //get body parser
var morgan = require('morgan'); //used to log requests
var mongoose = require('mongoose'); //for working with our db
var port = process.env.PORT || 8080; //sets the port our app will use

// APP CONFIGURATION ---------------------
// Uses body-parser to grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
  next();
});

// log all requests to the console
app.use(morgan('dev'));

// ROUTES FOR OUR API
// =============================

// basic route for the home page
app.get('/', function(req, res){
  res.send("Welcome to the home page!");
});

// get an instance of the express router
var apiRouter = express.Router();

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res){
  res.json({"Hooray, welcome to our api!"});
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// START THE SERVER
// ===============================
app.listen(port);
console.log('Magic happens on port ' + port);
