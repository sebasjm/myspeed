#!/usr/bin/env node

'use strict';

var http = require('http');
var program = require('commander');
var Server = require('../lib/server');
var Client = require('../lib/client');

program.version(require('../package').version);

program
  .command('client <url>')
  .description('open a speed test with the supplied server')
  .action(function createClient(url) {
    console.log();

    console.log('Running Speed Test ∙∙∙∙∙·▫▫ᵒᴼᵒ▫ₒₒ▫ᵒᴼᵒ▫ₒₒ▫ᵒᴼᵒ☼)===>');

    return Client({ url: 'ws://' + url }).test(function(err, result) {
      if (err) {
        console.log('[error]', err.message);
        process.exit();
      }

      console.log('                                           ');
      console.log('+-----------------------------------------+');
      console.log('| * Download Speed: %d Mbps', result.download);
      console.log('| * Upload Speed:   %d Mbps', result.upload  );
      console.log('+-----------------------------------------+');
      console.log('                                           ');
    });
  });

program
  .command('server [port]')
  .description('start a speed test server that clients can use')
  .action(function createServer(port) {
    console.log('(¯`·._.·(¯`·._.· SpeedOfMe Server Running ·._.·´¯)·._.·´¯)');
    console.log('                         Port: ' + (port || Server.DEFAULTS.port));
    return Server({ port: port });
  });

program.parse(process.argv);

if (process.argv.length < 3) {
  return program.help();
}
