'use strict';
var express = require('express')
var util = require('util');
var app = express();
app.use (express.json());

var path = require('path');
var couchbase = require("couchbase");
var config = require("./config");
const axios = require('axios');

const sgAdmin = axios.create({
  baseURL: util.format("http://%s/gameinfo/", config.syncgateway.server),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': {
      'username': config.syncgateway.user,
      'password': config.syncgateway.password
    }
  }
});

var gameInfoBucket;
var gameInfoCollection;
const cluster = couchbase.Cluster.connect(config.couchbase.server,{
  username: config.couchbase.user,
  password: config.couchbase.password
}).then((clstr)=>{
  gameInfoBucket = clstr.bucket(config.couchbase.gameInfo);
  gameInfoCollection = gameInfoBucket.defaultCollection();
  console.log("Opened gameInfoCollection");
  var record = new Object();
  record.service = "Registration Service";
  record.lastConnection = Math.floor(new Date().getTime() / 1000);
  gameInfoCollection.upsert("registrationService", record, (err, result) => {
    if(err) {
      console.log('Error testing Couchbase collectionconnection', err);
      process.exit(1);
    } else {
      module.exports.gameInfoBucket = gameInfoBucket;
      module.exports.gameInfoCollection = gameInfoCollection;
    }
  });

});

module.exports.sgAdmin = sgAdmin;

//app.use(express.static(path.join(__dirname, 'public')));


require('./routes/routes')(app);

// Handle errors
const createError = require('http-errors');
app.use((error, req, res, next) => {
  console.log('Error status: %s message: %s ', error.status, error.message)
  res.status(error.status)
  res.json({status: error.status, message: error.message})
})

var server = app.listen(config.listenPort, function () {
    console.log("Treasure Hunt microservice listening on port %s...", server.address().port);
});