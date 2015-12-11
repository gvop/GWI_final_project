var databaseUrl = process.env.MONGOLAB_URI || "mongodb://localhost:27017/zine_player"

module.exports = {
  database: databaseUrl
}

