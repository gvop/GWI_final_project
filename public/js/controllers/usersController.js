angular
.module('zine')
.controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', '$state', 'CurrentUser', '$auth', "$window", "socket"];
function UsersController(User, TokenService, $state, CurrentUser, $auth, $window, socket){

  var self = this;

  self.all                  = [];
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

  // Actions to carry once register or login forms have been submitted
  function handleLogin(res) {
    var token = res.token ? res.token : null;
    if (token) {
      self.getUsers();
      self.user = TokenService.decodeToken();
      CurrentUser.saveUser(self.user)
      socket.emit("login", self.user);
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
  }

  // Checks if the user is logged in
  function checkLoggedIn() {
    var loggedIn = !!TokenService.getToken();
    return loggedIn;
  }

  function addFriend(friend,user){

    if(friend._id == self.creator._id) return  Materialize.toast("Are you not friend with yourself?", 4000);

    var data = {
      friend : friend,
      user: self.creator
    }

    User.addFriend(data, function(){
      console.log(data.user)
      self.user = data.user;
    })

  }



function sendMessageToFriend(friend,message){
  console.log(friend)

  var messagePackage = {
    friend : friend._id,
    message: message
  }

  socket.emit("message-friend", messagePackage);

  Materialize.toast("Send message: " + message + " to: " + friend.local.username , 4000)
  $(".message").val(function() {
    return this.defaultValue;
  });

}

socket.on("message-to-friend", function(data) {
  console.log(data)
})

socket.on("connect", function(){
  console.log("connected")
})

socket.on("subscribed", function(){
  console.log(socket);
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