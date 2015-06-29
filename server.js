'use strict';

var koa = require('koa');
var router = require('koa-router')();
var proxy = require('koa-http-proxy');
var serve = require('koa-static');

var http = require('http');
var https = require('https');
var fs = require('fs');
var forceSSL = require('koa-force-ssl');

var app = koa();

// Force SSL on all page
app.use(forceSSL());

// SSL options
var options = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem')
}

// start the server
http.createServer(app.callback()).listen(3000);
https.createServer(options, app.callback()).listen(3001);


router.get('/api/v1/sessions', proxy({
  target: 'https://dealerportaltest.m2group.com.au/api/v1/Users/Login',
	secure: false
}));

app
  .use(router.routes())
  .use(router.allowedMethods());

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

