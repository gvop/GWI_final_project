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
  self.searchText     = "";
  self.sortBy         = "";
  self.show           = true;


  self.getContents = function(){
    Content.query(function(data){
      $('.slider').slider({full_width: true});
      userStartUpSift()
      return self.all = data.content;
    })
  }

  self.popup = function(index,content){
    // $('#popup_content').empty();
    console.log(content.network)
    if(content.network === "BBC") {
      $('#popop_'+ index + "_info").append(content.synopsis)
    } else {
      $.getJSON('http://en.wikipedia.org/w/api.php?action=parse&format=json&callback=?', {page:content.title, prop:'text', uselang:'en'}, function(data){ 
        var splitText = "<p><i><b>"
        var str = data.parse.text['*']
        var res = str.split(splitText);
        var splitTextTwo  = '<div id="toc" class="toc">'
        var strTwo        = res[1]
        var resTwo        = strTwo.split(splitTextTwo);
        console.log(resTwo[0])
        $('#popop_'+ index + "_info").append(resTwo[0])
      });
    }

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
      // $("#content_" + contentId).css('visibility','hidden')
      $("#content_" + contentId).replaceWith( "<p>On your playlist!</p>" );
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
  self.addComment = function(content, id){
    console.log(id)
    var comment = self.commentText;

    var data = {
      comment   : self.commentText,
      user      : self.creator._id
      // contentId : content._id
    }

    Content.addComment({id: content._id}, data, function(data){
      Materialize.toast(data.message, 4000)
      self.commentText = " ";
      $('#commentbox_' + id).append("<p>"+ comment +"</p>")
      console.log("line 109")
      // socket.emit("comment-added", comment);
      // socket.emit("interested-channel", content);
    })
  }

  function userStartUpSift(){
    var id = self.creator._id
    User.get({id : id}, function(data) {
      console.log(data.contents)
      for(i = 0; i < data.contents.length; i++){
        var id = data.contents[i]._id
        $("#content_" + id).replaceWith( "<p>On your playlist!</p>" );
      }
    });
  }

  self.startSlider = function(){
    $('.slider').slider({full_width: true});
  }


  self.getContents();
  self.getUsers();


  // socket.on("connect", function(){
  //   console.log("connected")
  // })

  // socket.on("everyone-apart-from-me", function(data) {
  //   console.log(data)
  //   Materialize.toast(data, 4000);
  // })

  // socket.on("message", function(data) {
  //   Materialize.toast(data, 4000);
  // })
}