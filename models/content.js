var mongoose      = require("mongoose")
var findOrCreate  = require("mongoose-findorcreate")

var contentSchema    = mongoose.Schema({
  network:String,
  title: String,
  synopsis: String,
  url: String,
  image: String,
  availability: String
})

contentSchema.plugin(findOrCreate)

module.exports = mongoose.model("Content", contentSchema)

