var request         = require("request");
var cheerio         = require("cheerio");
var routes          = require('../config/routes');
var Content         = require("../models/content")

//SCRAPE FUNCTION
function scrape(url,callback){
  return request.get(url, function(err, response, body){
    if(err) return console.log(err)
      if(response.statusCode === 200) callback(body)
    })
}

//Picture helper
function createFullLink(link){
  return  (link.split("?"))[0] 
}

//ADD TO THE DATABASE
function databasePost(data){
  Content.findOrCreate(
    {   network:  data.network,
        title:    data.title,
        synopsis: data.synopsis,
        url:      data.url,
        image:    data.image,
        availability: data.availability }, function(err, link, created) {
    if (err) return console.log("There was an error saving "  + err.errmsg);
    if (created) return console.log("New programms have beeing added");
    Content.findByIdAndUpdate(link._id, data, function(err, link) {
      if (err) return console.log("There was an error updating"  + err.errmsg);
      return console.log("Database updated");
    })
  })
}

//CALLBACK FUNCTIONS
function bbcIplayer(body) {
  var $     = cheerio.load(body);
  $(".list-item-link").each(function(){
    var urlBase = "http://www.bbc.co.uk/"
    var data = {}
    data.network        = "BBC"
    data.title          = $(this).children("div").children('.title').text()
    data.synopsis       = $(this).children("div").children('.synopsis').text()
    data.url            = urlBase + $(this).attr("href")
    data.image          = $(this).children("div.primary").children("div.r-image").attr("data-ip-src")
    data.availability   = $(this).children("div.tertiary").children(".availability").children(".period").attr("title")

    databasePost(data)
  })
}

function itvIplayer(body) {
  var $     = cheerio.load(body);
  $(".width--one-half").each(function(){
    var data = {}
    data.network           = "ITV"

    data.title             = $(this).children("a").children("article").children("div").children("header").children("h2").text()

    data.synopsis          = $(this).children("a").children("article").children("div").children("header").children("h2").text()

    data.url               = $(this).children("a.complex-link").attr("href")

    data.image             = $(this).children("a").children("article").children("div").children("div").children("noscript").children(".fluid-media__media").attr("src")

    data.availability      = "N/A"

    // data.broadcastDate     = $(this).children("a").children("article").children("div").children("header").children("p").children("time").text() 

    console.log(data.image)

    databasePost(data)
  })
}

function channel4Iplayer(body) {
  var $     = cheerio.load(body);
  $(".mediaBlockList-blockHolder").each(function(){
    var prefix  = "http://www.channel4.com/"
    var suffix  = "/on-demand/"
    var data    = {}



    data.network        = "CHANNEL 4"

    data.title          = $(this).children("div").children('a').children("div.mediaBlock-bottomOuter").children('.mediaBlock-top').children('h2').text()

    data.synopsis       = $(this).children("div").children('a').children("div.mediaBlock-bottomOuter").children('.mediaBlock-top').children('h2').text()

    data.url            = prefix + createFullLink($(this).children("div").children('a').attr("href")) + suffix 

    data.image          = createFullLink($(this).children("div").children('a').children('div').children('img').attr('src'))

    data.availability      = "N/A"

    databasePost(data)
  })
}

// //BBC IPLAYER
scrape("http://www.bbc.co.uk/iplayer/group/most-popular", bbcIplayer)

//ITV MAIN PAGE
scrape("http://www.itv.com/", itvIplayer)

// //CHANNEL 4
scrape("http://www.channel4.com/programmes", channel4Iplayer)



