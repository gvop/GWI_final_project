angular
.module('zine')
.controller('ContentsController', ContentsController);

ContentsController.$inject = ["Content", "User", "CurrentUser", "TokenService", "$window"]
function ContentsController(Content, User, CurrentUser, TokenService, $window){
  var self = this;

  self.all          = [];
  self.users        = [];
  self.content      = {}; 
  self.userContent  = [];

  self.getContents = function(){
    Content.query(function(data){
      return self.all = data.content;
    })
  }

  self.popup = function(content){
    $('#popup_content').empty();
    $.getJSON('http://en.wikipedia.org/w/api.php?action=parse&format=json&callback=?', {page:content.title, prop:'text', uselang:'en'}, function(data){ 
      $('#popup_content').append(data.parse.text['*']);
    });

    

    console.log(content)
    $('#modal1').openModal();
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

 self.add = function(data){
  var title     = data.title
  var userId    = self.creator._id
  var contentId = data._id

  var data = {
    userId: userId,
    contentId: contentId
  }


  User.addContent(data, function(data){

    Materialize.toast(title + " <br> is added to your watchlist!", 4000)
  })
}

self.remove = function(id){
  var userId    = self.creator._id
  var contentId = id

  var data = {
    userId: userId,
    contentId: contentId
  }

  console.log(data)

  User.deleteContent(data, function(data){

  })
}

self.getContents();
self.getUsers();

  // console.log(CurrentUser.getUser());
}