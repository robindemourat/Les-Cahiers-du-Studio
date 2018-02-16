
const path = require('path');
const fs = require('fs-extra');
const flags = require('flags');
const JSONStorage = require('node-localstorage').JSONStorage;
const portscanner = require('portscanner');

const server = require('./server');

const
  local  = require('./local'),
  config = require('./config.json'),
  dev = require('./bin/dev-log')
;

console.log(process.versions);

flags.defineBoolean('debug');
flags.defineBoolean('verbose');
flags.parse();

const debug = flags.get('debug');
const verbose = flags.get('verbose');
dev.init(debug, verbose);

if( global.appInfos === undefined) {
  global.appInfos = {};
}

global.appInfos.version = require('./package.json').version;

dev.log(`——— Starting les-cahiers app version ${global.appInfos.version}`);

copyAndRenameUserFolder().then(function(pathToUserContent) {

  global.pathToUserContent = pathToUserContent;
  dev.log('Will store contents in: ' + global.pathToUserContent);

  portscanner.findAPortNotInUse(config.port, config.port + 20).then((port) => {

    dev.log(`main.js - Found available port: ${port}`);
    global.appInfos.port = port;
    global.appInfos.homeURL = `${config.protocol}://${config.host}:${global.appInfos.port}`;

    server();

  }, function(err) {
    dev.error( 'Failed to find available port: ' + err);
  });

}, function(err) {
  dev.error( 'Failed to check existing content folder : ' + err);
});

function copyAndRenameUserFolder() {
  return new Promise(function(resolve, reject) {
    // is there a content folder
    const pathToUserContent = 'content';
    fs.access('content', fs.F_OK, function(err) {
      if(err) {
        const sourcePathInApp = local.settings().contentDirname;
        fs.copy(sourcePathInApp, pathToUserContent, function (err) {
          resolve(pathToUserContent);
        });
      } else {
        resolve(pathToUserContent);
      }
    });

  });
}
