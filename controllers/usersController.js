var User   = require('../models/user');

function usersIndex(req, res) {
  User.find(function(err, users){
    if (err) return res.status(404).json({message: 'Something went wrong.'});
    res.status(200).json({ users: users });
  });
}


function usersShow(req, res){
  var id = req.params.id;

  User.findById({ _id: id }).populate(["contents","friends"]).exec(function(err, references) {
    if (err) return res.status(500).send(err);
    if (!references) return res.status(404).send(err);
    // console.log(User.contents.title)
    // console.log(references.contents.title)
    res.status(200).send(references);
  })
}


function usersUpdate(req, res){
  User.findById(req.params.id,  function(err, user) {
    if (err) return res.status(500).json({message: "Something went wrong!"});
    if (!user) return res.status(404).json({message: 'No user found.'});

    if (req.body.email) user.local.email = req.body.name;
    if (req.body.password) user.local.password = req.body.password;

    user.save(function(err) {
     if (err) return res.status(500).json({message: "Something went wrong!"});

      res.status(201).json({message: 'User successfully updated.', user: user});
    });
  });
}

function usersDelete(req, res){
  User.findByIdAndRemove({_id: req.params.id}, function(err){
   if (err) return res.status(404).json({message: 'Something went wrong.'});
   res.status(200).json({message: 'User has been successfully deleted'});
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

function deleteContent(req,res){

  var userId = req.body.userId
  var contentId = req.body.contentId
  User.findByIdAndUpdate({_id: userId }, {$pull: {"contents": contentId }}, function(error){
    if(error) return res.status(403).send({message: 'Could not add content b/c' + error});
    return res.status(200).json({message: 'has been deleted of your list'});
  });

}

function addFriend(req,res){

  var userId    = req.body.user._id

  var friendId  = req.body.friend._id

  User.findByIdAndUpdate({_id: userId }, {$push: {"friends": friendId }}, function(error, user){
    if(error) return res.status(403).send({message: 'Could not add friend b/c' + error});
    return res.status(200).json({message: 'has been added to your list', user:user});
  });
}


module.exports = {
  usersIndex:     usersIndex,
  usersShow:      usersShow,
  usersUpdate:    usersUpdate,
  usersDelete:    usersDelete,
  addContent:     addContent,
  deleteContent:  deleteContent,
  addFriend:      addFriend
}