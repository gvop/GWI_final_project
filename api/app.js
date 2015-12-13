var express         = require('express');
var cors            = require('cors');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var morgan          = require('morgan');

var mongoose        = require("mongoose");
var config          = require("./db/config")
var app             = express();

var routes          = require('./config/routes');
var Content         = require("./models/content")

var scraper         = require("./scraper/scraper")

mongoose.connect(config.database)

// Setup Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === "object" && "_method" in req.body){
    var method = req.body._method;
    delete req.body._method;
    return method; 
  }
}));

app.use(routes);

app.listen(process.env.PORT || 3000);
console.log("Express is alive and listening.")



