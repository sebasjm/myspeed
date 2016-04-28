'use strict';

var expect = require('chai').expect;
var Client = require('../lib/client');
var Server = require('../lib/server');

describe('myspeed/integration', function() {

  it('should perform the bandwidth test and return results', function(done) {
    this.timeout(10000);

    var server = new Server({ port: 45123 });
    var client = new Client({ url: 'ws://127.0.0.1:45123' });

    client.test(function(err, results) {
      expect(err).to.equal(null);
      expect(results.download > 0).to.equal(true);
      expect(results.upload > 0).to.equal(true);
      done();
    });
  });

  it('should cleanup and stop streams if an error occurs', function(done) {
    this.timeout(10000);

    var server = new Server({ port: 45124 });
    var client = new Client({ url: 'ws://127.0.0.1:45123' });

    client.test(function(err, results) {
      expect(err.message).to.equal('Speed test ended early');
      done();
    });
    setImmediate(function() {
      client._socket.close();
    });
  });

});
