
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
var bodyParser = require('body-parser'); //get body parser
var morgan = require('morgan'); //used to log requests
var mongoose = require('mongoose'); //for working with our db
var User = require('./app/models/user');
var port = process.env.PORT || 8088; //sets the port our app will use [using port 8088 instead of 8080 due to conflict]

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

// DATABASE SETUP
// =============================
// connect to our database (hosted locally):
mongoose.connect('mongodb://localhost:27017/CRM_db')

// ROUTES FOR OUR API
// =============================

// basic route for the home page
app.get('/', function(req, res){
  res.send("Welcome to the home page!");
});

// get an instance of the express router
var apiRouter = express.Router();

//middleware to use for all requests
apiRouter.use(function(req, res, next){
  //do logging
  console.log('Somebody just visited our app!');


  next(); //make sure we go to the next routes
});

// test route to make sure everything is working
// accessed at GET http://localhost:8088/api
apiRouter.get('/', function(req, res){
  res.json({message: "Hooray, welcome to our api!"});
});

// on routes that end in /users
// ----------------------------------------------------
apiRouter.route('/users')

    // create a user (accessed at POST http://localhost:8088/api/users)
    .post(function(req, res){
        var user = new User(); // create new instance of User model
        user.name = req.body.name; // set the user's information (comes from the request)
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){ // save the user and check for errors
          if(err){
            // if it's a duplicate entry
            if(err.code == 11000)
              return res.json({success: false, message: 'A user with that \ username already exists. '});
            else
              return res.send(err);
          }
          res.json({message: 'User created!'});
        });
    })

    // {
    //   "_id": "56da1f235f16d5901ac47dcb",
    //   "username": "blakers",
    //   "name": "Blake",
    //   "__v": 0
    // }

    // get all the users (accessed at GET http://localhost:8088/api/users)
    .get(function(req, res){
        User.find(function(err, users){
          if(err)
            res.send(err);
          res.json(users); // return the users if no errors
        })
    })

// on routes that end in /users/:user_id
// ----------------------------------------------------

apiRouter.route('/users/:user_id')

    // get the user with that id (accessed at GET http://localhost:8088/api/users/:user_id)
    .get(function(req, res){
        User.findById(req.params.user_id, function(err, user){
          if(err)
            res.send(err);
          res.json(user); // if no error, return that specific user
        });
    })

    // update the user with this id (accessed at PUT http://localhost:8088/api/users/:user_id)
    .put(function(req, res){
        // Use the Model to find the user we want
        User.findById(req.params.user_id, function(err, user){
            if(err)
                res.send(err);
            // Update the user's info only if it is new
            if(req.body.name)
                user.name = req.body.name;
            if(req.body.username)
                user.username = req.body.username;
            if(req.body.password)
                user.password = req.body.password;

            // Save the user_id
            user.save(function(err){
                if(err)
                    res.send(err);
                // Send success message
                res.json({message: 'User updated!'});
            });
        });
    })

    // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
    .delete(function(req, res){
        User.remove({
            _id: req.params.user_id
          }, function(err, user){
            if(err)
              return res.send(err);
            res.json({message: 'User successfully deleted!'})  // if no errors, delete user
          });
        })

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// START THE SERVER
// ===============================
app.listen(port);
console.log('Magic happens on port ' + port);
