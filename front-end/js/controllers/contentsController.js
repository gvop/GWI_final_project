angular
  .module('logging')
  .controller('ContentsController', ContentsController);

ContentsController.$inject = ["Content", "User", "CurrentUser", "TokenService", "$window"]
function ContentsController(Content, User, CurrentUser, TokenService, $window){
  var self = this;

  self.all     = [];
  self.users   = [];
  self.content = {}; 

  self.getContents = function(){
    Content.query(function(data){
      return self.all = data.content;
    })
  }

  //IF CURRENT USER INFO
  if ($window.localStorage['auth-token']) {
      self.creator = TokenService.parseJwt();
    }


  self.getUsers = function(){
     User.query(function(data){
      return self.users = data.users;
    });
  }

  self.add = function(id){
    var userId    = self.creator._id
    var contentId = id

    var data = {
      userId: userId,
      contentId: contentId
    }

    console.log(data)

    User.addContent(data, function(data){
      // self.all.push(data);
      // self.content = {};
    })
  }

  self.getContents();
  self.getUsers();

  // console.log(CurrentUser.getUser());
}