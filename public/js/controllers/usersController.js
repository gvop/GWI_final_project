angular
.module('zine')
.controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', '$state', 'CurrentUser', '$auth', "$window", "socket"];
function UsersController(User, TokenService, $state, CurrentUser, $auth, $window, socket){

  console.log("RUNNING ONCE?!")

  var self = this;

  self.all                  = [];
  self.friends              = [];
  self.user                 = {};
  self.getUsers             = getUsers;
  self.getUser              = getUser;
  self.register             = register;
  self.login                = login;
  self.logout               = logout;
  self.checkLoggedIn        = checkLoggedIn;
  self.getProfile           = getProfile;
  self.addFriend            = addFriend;
  self.sendMessageToFriend  = sendMessageToFriend;
  self.checkFriends         = checkFriends;
  self.removeFriend         = removeFriend;
  self.hideForm             = hideForm;
  self.messageForm          = messageForm;


  self.authenticate = function(provider) {
    $auth.authenticate(provider);
  };

  if ($window.localStorage['auth-token']) {
    self.creator = TokenService.parseJwt();
  }

  // GETs all the users from the api
  function getUsers() {
    User.query(function(data){
     return self.all = data.users;
   });
  }

  function getUser (data){
   var id = data._id
   User.get({id : id}, function(data) {
     return self.user = data
    });
  }

 function getProfile(){
  return getUser(self.creator)
  }

  function hideForm(){
    $(".form-hide").hide()
  }

  function checkFriends(){
    var id = self.creator._id
    User.get({id : id}, function(data) {
      for(i = 0; i < data.friends.length; i++){
        var id = data.friends[i]._id
        $("#follow_" + id).hide();
      }
    });

  }


  // Actions to carry once register or login forms have been submitted
  function handleLogin(res) {
    var token = res.token ? res.token : null;
    if (token) {
      self.getUsers();
      self.user = TokenService.decodeToken();
      CurrentUser.saveUser(self.user)
      var socketId = socket.socket().io.engine.id;
      // console.log(socketId)
      var data = {
        user_id: self.user._id,
        socketId: socketId
      }
      socket.emit("login", data);
      $state.go('home');
    }
    // console.log(res);
    // self.user = TokenService.decodeToken();
    // CurrentUser.saveUser(self.user)
  }

  // POSTS the new user to register to the API
  function register() {
    User.register(self.user, handleLogin);
  }

  // POSTS the new user to login to the API
  function login() {
    User.login(self.user, handleLogin);
  }

  // A function to remove token form local storage and log user out
  function logout() {
    TokenService.removeToken();
    self.all  = [];
    self.user = {};
    CurrentUser.clearUser();
    $window.location.reload();
  }

  // Checks if the user is logged in
  function checkLoggedIn() {
    var loggedIn = !!TokenService.getToken();
    return loggedIn;
  }


  function addFriend(friend){
    friendId  = friend._id
    id        = self.creator._id;

    $("#follow_" + friend._id).hide()

    if(friend._id == self.creator._id) return  Materialize.toast("Are you not friend with yourself?", 4000);

    var data = {
      friend : friend,
      user: self.creator
    }

    User.addFriend(data, function(){
      return  Materialize.toast("Added as friend!", 4000);
    })
    }


    function removeFriend(friend){
      console.log(friend)
      $(event.target.parentElement.parentElement.parentElement).fadeOut();

      var data = {
        userId: self.creator._id,
        friendId: friend._id
      }

      User.deleteFriend(data)
    }

  function messageForm(){
    $(event.target.parentElement.parentElement).next().toggle()
  }


  function sendMessageToFriend(friend, message){

    var messagePackage = {
      friend : friend,
      message: message
    }

    socket.emit("message-friend", messagePackage);

    // Materialize.toast("Send message: " + message + " to: " + friend.local.username , 4000)
    $(".message").val(function() {
      return this.defaultValue;
    });

  }

  // socket.on("message-to-friend", function(data) {
  //   console.log(data)
  // })

  socket.on("connect", function(){
    console.log("connected")
    if (self.creator) {
      var socketId = socket.socket().io.engine.id;
      var data = {
        user_id: self.creator._id,
        socketId: socketId
      }
      socket.emit("login", data);
    }
  })

  // socket.on("subscribed", function(user){
  //   var name = user.local.fullname
  //   return  Materialize.toast(name + " is logged in!", 8000);
  // })

  socket.on("personalMessage", function(data){
    var sender = data.friend.local.fullname
    return  Materialize.toast(sender + ": <br> " +data.message, 8000);
  })

  socket.on("tell-others", function(data){
    socket.emit("login", data);
  })


  // socket.on("message-to-friend", function(data) {
  //   console.log(data)
  //   Materialize.toast(data, 4000);
  // })


  // socket.on("everyone-apart-from-me", function(data) {
  //   console.log(data)
  //   Materialize.toast(data, 4000);
  // })


  // Checks if the user is logged in, runs every time the page is loaded
  if (CurrentUser.getUser()) {
    self.getUsers();
    self.user = TokenService.decodeToken();
    // console.log(self.user);
  }

  return self
}