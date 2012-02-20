/**
 * Created by JetBrains WebStorm.
 * User: paulcampbell
 * Date: 19/02/2012
 * Time: 17:41
 * To change this template use File | Settings | File Templates.
 */
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

FridgeProvider = function(host, port) {
  this.db= new Db('node-mongo-fridge', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


FridgeProvider.prototype.getCollection= function(callback) {
  this.db.collection('fridges', function(error, fridge_collection) {
    if( error ) callback(error);
    else callback(null, fridge_collection);
  });
};

FridgeProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, fridge_collection) {
      if( error ) callback(error)
      else {
        fridge_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


FridgeProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, fridge_collection) {
      if( error ) callback(error)
      else {
        fridge_collection.findOne({_id: fridge_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

FridgeProvider.prototype.find = function(hash, callback) {
  this.getCollection(function(error, fridge_collection) {
        if( error ) callback(error)
        else {
          fridge_collection.findOne(hash, function(error, result) {
            if( error ) callback(error)
            else callback(null, result)
          });
        }
      });
};


FridgeProvider.prototype.save = function(fridges, callback) {
    this.getCollection(function(error, fridge_collection) {

      if( error )
      {
        callback(error);
      }
      else {
        if( typeof(fridges.length)=="undefined")
          fridges = [fridges];

        for( var i =0;i< fridges.length;i++ ) {
          fridge = fridges[i];
          fridge.created_at = new Date();
          if( fridge.letters === undefined ) fridge.letters = [];

        }

        fridge_collection.insert(fridges, function() {
          callback(null, fridges);
        });
      }
    });
};

exports.FridgeProvider = FridgeProvider;