// Routes
var axios = require("axios");
var cheerio = require("cheerio");


var db = require("../models");

var path = require("path");

module.exports = function(app) {
  
  // app.get('/', function(req, res) {
  //     res.sendFile(path.join(__dirname, "../index.html"));
  // });

  // A GET route for scraping the echojs website
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://news.ycombinator.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);


      // Now, we grab every h2 within an article tag, and do the following:
      $("tr.athing").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children('td.title')
          .children('a')
          .text();
        
        result.link = $(this)
          .children("td.title")
          .children('a')
          .attr("href");

        result.upvotes = $(this)
          .next()
          .children('td.subtext')
          .children('span.score')
          .text();

        result.author = $(this)
          .next()
          .children('td.subtext')
          .children('a.hnuser')
          .text();

        console.log(result);

        // Create a new Article using the `result` object built from scraping
        db.article
          .create(result)
          .then(function(dbArticle) {
            // If we were able to successfully scrape and save an Article, send a message to the client
            res.send("Scrape Complete");
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      });
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.article
      .find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.article
      .findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(request, res) {
    
    // Create a new note and pass the req.body to the entry
    console.log(request);
    console.log(request.req);
    // db.note
    //   .create(req.body)
    //   .then(function(dbNote) {
    //     // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
    //     // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    //     // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    //     return db.article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    //   })
    //   .then(function(dbArticle) {
    //     // If we were able to successfully update an Article, send it back to the client
    //     res.json(dbArticle);
    //   })
    //   .catch(function(err) {
    //     // If an error occurred, send it to the client
    //     res.json(err);
    //   });
  });

};