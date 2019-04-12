var db = require("../models");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index", res);
  });

  app.get("/articles", function(req, res) {
    res.json(articles)
  });

};