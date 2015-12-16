var Content = require("../models/content");

function contentsIndex(req, res){
  Content.find({}, function(err, content) {
    if (err) return res.status(404).send(err);
    res.status(200).json({ content: content});
  });
}

function addContent(req,res){
  var userId = req.body.userId
  var contentId = req.body.contentId

  User.findByIdAndUpdate({_id: userId }, {$push: {"contents": contentId }}, function(error){
    if(error) return res.status(403).send({message: 'Could not add content b/c' + error});
    return res.status(200).json({message: 'has been added to your list'});
  });

}


module.exports = { 
  contentsIndex:  contentsIndex,
}

