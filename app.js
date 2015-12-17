var express         = require('express');
var cors            = require('cors');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var morgan          = require('morgan');
var mongoose        = require("mongoose");
var config          = require("./db/config")
var app             = express();
var routes          = require('./config/routes');
var Content         = require("./models/content")

var http            = require('http');
var server          = http.createServer(app);
var port            = process.env.PORT || 3000;

//SCRAPER
var scraper         = require("./scraper/scraper")

////USER LOGIN
var path           = require('path');
var passport       = require('passport');
var cookieParser   = require("cookie-parser");
var jwt            = require('jsonwebtoken');
var expressJWT     = require('express-jwt');

// Models
var User           = require('./models/user');
var secret         = require('./db/config').secret;

mongoose.connect(config.database)

// Setup Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());
require('./config/passport')(passport);

// app.use('/api', expressJWT({ secret: secret })
//   .unless({
//     path: [
//       { url: '/api/login', methods: ['POST'] },
//       { url: '/api/register', methods: ['POST'] }
//     ]
//   }));

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === "object" && "_method" in req.body){
    var method = req.body._method;
    delete req.body._method;
    return method; 
  }
}));

app.use(routes);

// Setup static files to be served from public
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
})

// var server = app.listen(3000);
server.listen(port);
console.log('Server started on ' + port);


// Integrate socket
var io = require('socket.io')(server);

io.on("connect", function(socket){

  socket.on("login", function(user){
    user.join(user._id)
    user.friends.forEach(function(friend){
      socket.join(friend);
      console.log(friend + " was joined...")
    })
    io.emit("subscribed")
  })

  socket.on("message-friend", function(data){
    console.log("message-friend:" + data.friend)
    // socket.broadcast.to(socketid).emit('message', 'for your eyes only');
    socket.broadcast.to(data.friend._id).emit('message-to-friend', data);
  })

  // socket.on("comment-added", function(data){
  //   socket.broadcast.emit("everyone-apart-from-me", data)
  // })

  // socket.on("interested-channel", function(content) {
  //   socket.broadcast.to(content._id).emit('message', "koek koek");
  // })
});

// // sending to sender-client only
// socket.emit('message', "this is a test");
// ​
// // sending to all clients, include sender
// io.emit('message', "this is a test");
// ​
// // sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");
// ​
// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');
// ​
// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');
// ​
// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');
// ​
// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');
// ​
// // sending to individual socketid (server-side)
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');
// ​
// // join to subscribe the socket to a given channel (server-side):
// socket.join('some room');
// ​
// // then simply use to or in (they are the same) when broadcasting or emitting (server-side)
// io.to('some room').emit('some event'):
// ​
// // leave to unsubscribe the socket to a given channel (server-side)
// socket.leave('some room');





