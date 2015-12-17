var mongoose = require('mongoose');

var databaseURL = 'mongodb://localhost:27017/zine_player';
mongoose.connect(databaseURL);

var User     = require("../models/user")

var user1 = new User({ 
  local: {
    username:     "oliverholden",
    fullname:     "Oliver Holden",
    image:        "http://hassifier.herokuapp.com/ollie",
    email:        "ollie@ollie.com",
    password:     "password"
  }
})

user1.save(function(err, user) {
 if (err) return console.log(err);
 console.log("User saved! ", user);
})

var user2 = new User({ 
  local: {
    username:     "guusvanooijen",
    fullname:     "Guus van Ooijen",
    image:        "http://hassifier.herokuapp.com/guus",
    email:        "guus@guus.com",
    password:     "password"
  }
})

user2.save(function(err, user) {
 if (err) return console.log(err);
 console.log("User saved! ", user);
})

var user3 = new User({ 
  local: {
    username:     "benlayer",
    fullname:     "Ben Layer",
    image:        "http://hassifier.herokuapp.com/ben",
    email:        "ben@ben.com",
    password:     "password"
  }
})

user3.save(function(err, user) {
 if (err) return console.log(err);
 console.log("User saved! ", user);
})

var user4 = new User({ 
  local: {
    username:     "martygromley",
    fullname:     "Marty Gromley",
    image:        "http://hassifier.herokuapp.com/marty",
    email:        "marty@marty.com",
    password:     "password"
  }
})

user4.save(function(err, user) {
 if (err) return console.log(err);
 console.log("User saved! ", user);
})

var user5 = new User({ 
  local: {
    username:     "calumcamble",
    fullname:     "Calum Camble",
    image:        "http://hassifier.herokuapp.com/calum",
    email:        "calum@calum.com",
    password:     "password"
  }
})

user5.save(function(err, user) {
 if (err) return console.log(err);
 console.log("User saved! ", user);
})


