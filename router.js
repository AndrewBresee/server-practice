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

  app.get('/delete', function(req, res){
    var requestedTitle = req.headers.title;
    Post.find({title: requestedTitle}).remove(function(err, data){
      if(err){
        res.statusCode(404).json(err);
        console.log("Could not find");
      } else {
        res.send(200, data);
        console.log("Data Found!");
      }
    });
  });


  //For updating, Post.update({ title: title}, { $set: { content: something }}, callback);


};
