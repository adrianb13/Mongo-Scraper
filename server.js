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
  axios.get("https://www.forbes.com/investing/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("div.stream-article-text").each(function(i, element) {
      var result = {};
  
      result.title = $(element)
        .find(".article-headline")
        .text();
      result.link = $(element)
        .children("a")
        .attr("href");
      result.summary = $(element)
        .find(".article-headline")
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
  
  // Route for grabbing a specific Article by id, populate it with it's note
/*   app.get("/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.find({"_id": req.params.id})
      .populate("Note")
      .then(function(dbArticle) {
        res.json(dbArticle)
      })
      .catch(function(err) {
        res.json(err);
      })
  }); */
  
  // Route for saving/updating an Article's associated Note
/*   app.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ "_id": req.params.id}, { note: dbNote._id } , { new: true});
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
    });
  }); */
  
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });