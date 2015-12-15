var mongoose      = require("mongoose")
var findOrCreate  = require("mongoose-findorcreate")

var commentSchema    = mongoose.Schema({
  comment:String,
  userId:String,
  contentId: String
})

commentSchema.plugin(findOrCreate)

module.exports = mongoose.model("Comment", commentSchema)
