angular
.module('zine')
.controller('ContentsController', ContentsController)

ContentsController.$inject = ["Content", "User", "CurrentUser", "TokenService", "$window", "socket"]
function ContentsController(Content, User, CurrentUser, TokenService, $window, socket){
  var self = this;

  self.all            = [];
  self.users          = [];
  self.contents       = [];
  self.userContent    = [];
  self.commentText    = "";
  self.contentComment = [];

  self.getContents = function(){
    Content.query(function(data){
      return self.all = data.content;
    })
  }

  self.popup = function(index){
    // $('#popup_content').empty();
    // $.getJSON('http://en.wikipedia.org/w/api.php?action=parse&format=json&callback=?', {page:content.title, prop:'text', uselang:'en'}, function(data){ 
    //   $('#popup_content').append(data.parse.text['*']);
    // });
    $('#popop_'+ index).openModal();
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

  //ADD PROGRAMM TO PLAYLIST
  self.add = function(data){

    console.log(self.creator.contents)

    var title     = data.title
    var userId    = self.creator._id
    var contentId = data._id

    var data = {
      userId: userId,
      contentId: contentId 
    }

    User.addContent(data, function(data){
      self.creator.contents.push(contentId)
      Materialize.toast(title + data.message, 4000)
    })
  }

  //REMOVE PROGRAMM FOR UR LIST
  self.remove = function(content){
    $(event.target.parentElement.parentElement).hide();
   
    var data = {
      userId: self.creator._id,
      contentId: content._id
    }

    User.deleteContent(data, function(data){
      Materialize.toast(content.title + " " + data.message, 4000)
    })
  }

  //ADD A COMMENT TO A PROGRAMM
  self.addComment = function(content){
    var comment = self.commentText;

    var data = {
      comment   : self.commentText,
      user      : self.creator._id
      // contentId : content._id
    }

    Content.addComment({id: content._id}, data, function(data){
      Materialize.toast(data.message, 4000)
      self.commentText = " ";
      $('#commentbox').append("<p>"+ comment +"</p>")

      // socket.emit("comment-added", comment);
      socket.emit("interested-channel", content)
    })
  }

  self.getContents();
  self.getUsers();

  // console.log(CurrentUser.getUser());

  socket.on("connect", function(){
    console.log("connected")
  })

  socket.on("everyone-apart-from-me", function(data) {
    Materialize.toast(data, 4000);
  })

  socket.on("message", function(data) {
    Materialize.toast(data, 4000);
  })
}