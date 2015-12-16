angular
  .module('zine')
  .controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', '$state', 'CurrentUser', '$auth', "$window", "socket"];
function UsersController(User, TokenService, $state, CurrentUser, $auth, $window, socket){

  var self = this;

  self.all           = [];
  self.user          = {};
  self.getUsers      = getUsers;
  self.getUser       = getUser;
  self.register      = register;
  self.login         = login;
  self.logout        = logout;
  self.checkLoggedIn = checkLoggedIn;
  self.getProfile    = getProfile;


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

  // Checks if the user is logged in, runs every time the page is loaded
  if (CurrentUser.getUser()) {
    self.getUsers();
    self.user = TokenService.decodeToken();
    // console.log(self.user);
  }

return self
}