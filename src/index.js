Promise = require('bluebird');
const { port } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const http = require('http');
mongoose.connect();
http.createServer(app).listen(port);
module.exports = app;