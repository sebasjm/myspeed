'use strict';

var utils = require('./utils');
var constants = require('./constants');
var crypto = require('crypto');
var hat = require('hat');
var WritableStream = require('stream').Writable;
var RandomStream = require('noisegen');
var WebSocketServer = require('ws').Server;
var Stopwatch = require('timer-stopwatch');

/**
 * Creates a WebSocket server for testing bandwidth
 * @constructor
 * @param {Object} options
 * @param {Number} options.port
 */
function Server(options) {
  if (!(this instanceof Server)) {
    return new Server(options);
  }

  this._clients = {};
  this._port = options.port || Server.DEFAULTS.port;
  this._wss = new WebSocketServer({ port: this._port });

  this._wss.on('connection', this._handleConnection.bind(this));
}

Server.DEFAULTS = {
  port: 8080
};

/**
 * Handles incoming connection for speed test
 * @private
 * @param {Object} ws - Connected websocket
 */
Server.prototype._handleConnection = function(ws) {
  var self = this;
  var id = hat();
  var upstream = utils.createHasherStream(constants.UPLOAD_SIZE);
  var downstream = this._createDownloadStream();
  var uptime = new Stopwatch();
  var downtime = new Stopwatch();
  var completed = 0;

  function cleanup() {
    if (completed === 2) {
      self._closeConnection(id);
    }
  }

  this._clients[id] = {
    socket: ws,
    upstream: upstream,
    downstream: downstream
  };

  downtime.start();
  downstream.on('data', function(data) {
    ws.send(data, { binary: true });
  });

  upstream.on('finish', function() {
    uptime.stop();
    ws.send(JSON.stringify({
      upload: utils.toMbps(constants.UPLOAD_SIZE / uptime.ms)
    }));
    completed++;
    cleanup();
  });

  ws.on('message', function(data, flags) {
    if (flags.binary) {
      upstream.write(data);
    } else {
      try {
        data = JSON.parse(data);
      } catch (err) {
        return self._closeConnection(id);
      }

      if (data.hash === downstream.hash.toString('hex')) {
        downtime.stop();
        ws.send(JSON.stringify({
          download: utils.toMbps(constants.DOWNLOAD_SIZE / downtime.ms)
        }));
        uptime.start();
        completed++;
        cleanup();
      } else {
        return self._closeConnection(id);
      }
    }
  });

  ws.on('error', function(err) {
    self._closeConnection(id);
  });
};

/**
 * Destroy the socket
 * @private
 * @param {WebSocket} sock
 */
Server.prototype._closeConnection = function(id) {
  var client = this._clients[id];

  if (!client) {
    return;
  }

  client.socket.close();
  delete this._clients[id];
};

/**
 * Creates a random data stream
 * @private
 */
Server.prototype._createDownloadStream = function() {
  return new RandomStream({
    length: constants.DOWNLOAD_SIZE,
    size: 32 * 1024,
    hash: 'rmd160'
  });
};

module.exports = Server;
