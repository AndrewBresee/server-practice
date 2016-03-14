var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Post = require('./post.js');
var bodyParser = require('body-parser');
var db = mongoose.connection;


//This was from documentation online. Will need to refer back later.
app.use(bodyParser.urlencoded({
    extended: true
}));

// allows the post method to use bodyParser.
var jsonParser = bodyParser.json();

module.exports = function(app, express) {

  //Will create a post with a title and content
  app.post('/', jsonParser, function (req, res, next) {
    //This console.log tells me the post request in coming in right from postman
    console.log("REQUEST FROM POST :" , req.body);
    var post = new Post({
      title: req.body.title,
      content: req.body.content
    });
    post.save(function (err, post) {
      if (err) {
        return next(err);
      } else {
        res.json(201, post);
      }
    });
  });

  //Will get a specific post based on a requested title
  //Somewhat confused about using headers when doing GET
  app.get('/', jsonParser, function(req, res){
    console.log("GET REQUEST GOT");
    console.log("req.body :", req.headers.title);
    var requestedTitle = req.headers.title;
    Post.findOne({title: requestedTitle}, function(err, data){
      if(err){
        res.statusCode(404).json(err);
        console.log("Could not find");
      } else {
        console.log("Data Found! : ", data);
        res.json(200, data);
      }
    });
  });

  //What does next(err) do?
  //It seems that including {upsert: true} makes it so that if there isn't anything with that post, it will make a new one.
  app.put('/', jsonParser, function (req, res, next) {
    //This console.log tells me the post request in coming in right from postman
    console.log("UPDATE POST :" , req.body);
    var updateTitle = req.body.title;
    var updateContent = req.body.content;
    Post.update({ title: updateTitle}, { $set: { content: updateContent }}, function(err, data){
      if (err) {
        res.statusCode(404).json(err);
        //return next(err);
      } else {
        res.json(200, data);
      }
    });
  });

  app.delete('/', function(req, res){
    var requestedTitle = req.headers.title;
    Post.find({title: requestedTitle}).remove(function(err, data){
      if(err){
        res.statusCode(404).json(err);
        console.log("Could not find");
      } else {
        res.send(200, data);
        console.log("Data Deleted!");
      }
    });
  });


};
