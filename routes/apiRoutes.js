var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
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
    
      res.send("Your BUZZ is ready!");
    });
  });
    
  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    db.Article.find({})
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
      .populate("comment")
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
        return db.Article.findOneAndUpdate({ _id: req.params.id}, { comment: dbComment._id } , { new: true});
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
    });
  }); 
  
  app.delete("/articles/:id", function(req, res) {
    db.Comment.remove(req.body)
      .then(function(dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id}, { comment: dbComment._id });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
    });
  });
};