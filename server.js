var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var PORT = process.env.PORT || 3000;

var db = require("./models");
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
  axios.get("https://www.buzzfeednews.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    
    $("article").each(function(i, element) {
      var result = {};
    
      result.title = $(element)
        .find("h2.newsblock-story-card__title")
        .text();
      result.link = $(element)
        .children("a.newsblock-story-card__link")
        .attr("href");
      result.summary = $(element)
        .find("p.newsblock-story-card__description")
        .text();

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  
    res.send("Scrape Complete");
  });
});
  
// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .populate("Comment")
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(err) {
      res.json(err);
    })
}); 
  
// Route for grabbing a specific Article by id, populate it with it's comment
app.get("/articles/:id", function(req, res) {
  db.Article.find({"_id": req.params.id})
    .populate("Comment")
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(err) {
      res.json(err);
    })
}); 
  
// Route for saving/updating an Article's associated Comment
app.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ "_id": req.params.id}, { comments: dbComment._id } , { new: true});
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
  });
}); 

app.delete("/articles/:id", function(req, res) {
  db.Comment.remove(comment)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ "_id": req.params.id}, { comments: dbComment._id });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
  });
}); 
  
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});