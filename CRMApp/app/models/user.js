
// Grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// user Schema
var userSchema = new Schema({
    name: String,
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true, select: false}
});

// hash the password before the user is saved
userSchema.pre('save', funcion(next){
  var user = this;
  // only hash the password if it's a new user or the password has changed
      if(!user.isModified('password')) return next();
      // generate hash
      bcrypt.hash(user.password, null, null, function(err, hash){
        if (err) return next (err);
        //change password to the hashed version
        user.password = hash;
        next();
        });
});

//method to compare a given password with the db hash
userSchema.methods.comparePassword = function(password){
      var user = this;

      return bcrypt.compareSync(password, user.password);
};

// return the model
module.exports = mongoose.model('User', userSchema);
