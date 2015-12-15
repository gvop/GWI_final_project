var Comment = require("../models/comment");
var Content = require("../models/content");

function commentIndex(req,res){
  var contentId = req.params.id
  Comment.find({contentId: contentId}, function(err, comments) {
    if (err) return res.status(404).send(err);
    res.status(200).json({ comments: comments});
  });
}

function addComment(req,res){
  var comment = new Comment(req.body)
  comment.contentId = req.params.id

  Content.findById(req.params.id, function(err, content){
    content.comments.push(comment)
    content.save(function(data){
      res.status(200).json({message: "You've added a comment!"});
    })
  });

}

module.exports = { 
  commentIndex: commentIndex,
  addComment: addComment 
}
