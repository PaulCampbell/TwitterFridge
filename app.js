
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
var sys = require('sys'),
    twitter = require('twitter'),
_und = require("underscore");


var twit = new twitter();

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('twitter', twit);
  app.set('underscore', _und);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/fridge', routes.fridge);
app.get('/fridge/1.json', routes.fridgejson);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
