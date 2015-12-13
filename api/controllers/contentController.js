var Content = require("../models/content");

function contentsIndex(req, res){
  Content.find({}, function(err, content) {
    if (err) return res.status(404).send(err);
    res.status(200).json({ content: content});
  });
}

module.exports = { 
  contentsIndex:  contentsIndex,
}