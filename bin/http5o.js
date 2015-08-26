#!/usr/bin/env node

// based on http://expressjs.com/starter/static-files.html and
// https://davidbeath.com/posts/expressjs-40-basicauth.html

'use strict';

var express = require('express');
var http = require('http');
var app = express();
var basicAuth = require('basic-auth');
var fs = require('fs');
var server;

// pull config from env
var USERNAME = process.env['HTTP_USERNAME'] || 'http5o';
var PASSWORD = process.env['HTTP_PASSWORD'] || 'protectandserve';
var REALM    = process.env['HTTP_REALM'] || 'Authorization Required';
var DOCROOT  = process.env['DOCROOT'] || '.';
var INDEX    = process.env['INDEX_FILE'] || 'index.html';
var PORT     = process.env['PORT'] || 5000;
var DISABLE_HTTP_AUTH = process.env['DISABLE_HTTP_AUTH'];

var docroot_path = process.env['PWD'] + '/' + DOCROOT;

// test for existence of dir to serve & error out if it doesn't exist
try {
  fs.statSync(docroot_path).isDirectory();
} catch(e) {
  console.log("Error: Path " + docroot_path + " doesn't exist.");
  return(e.errno);
}

var staticMiddleware = express.static(docroot_path, {
  'index' : INDEX
});

var authMiddleware = function(req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=' + REALM);
    return res.sendStatus(401);
  }

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === USERNAME && user.pass === PASSWORD) {
    return next();
  } else {
    return unauthorized(res);
  }
};


var startupMsg = 'Serving ' + docroot_path + ' on port ' + PORT;

if (DISABLE_HTTP_AUTH) {
  app.use('/', staticMiddleware);
} else {
  app.use('/', authMiddleware, staticMiddleware);
  startupMsg += ' with credentials ' + USERNAME + "/" + PASSWORD;
}

// see http://glynnbird.tumblr.com/post/54739664725/graceful-server-shutdown-with-nodejs-and-express
var gracefulShutdown = function() {
  console.log("\nReceived kill signal, shutting down gracefully.");

  server.close(function() {
    console.log("Closed out remaining connections. Exiting.");
    process.exit();
  });
};

// listen for TERM signal (i.e. kill)
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal (i.e. ctrl-c)
process.on('SIGINT', gracefulShutdown);


server = http.createServer(app);
server.listen(PORT);
console.log(startupMsg + " ...");

server.on('error', function (e) {
  if (e.code === 'EADDRINUSE') {
    console.log('ERROR: Port %s in use.', PORT);
    process.exit(1);
  }
});
