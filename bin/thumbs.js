const
  sharp = require('sharp'),
  path = require('path'),
  fs = require('fs-extra'),
  ffmpegstatic = require('ffmpeg-static'),
  ffmpeg = require('fluent-ffmpeg')
;

const
  local  = require('../local'),
  dev = require('./dev-log')
;

ffmpeg.setFfmpegPath(ffmpegstatic.path);
ffmpeg.setFfprobePath(ffmpegstatic.path);

module.exports = (function() {

  const API = {
    makeMediaThumbs : (slugFolderName, slugMediaName, meta) => makeMediaThumbs(slugFolderName, slugMediaName, meta),
    readEXIFData    : mediaPath => readEXIFData(mediaPath)
  };

  // this function is used both when creating a media and everything media are listed.
  // this way, if thumbs are deleted or moved while the app is running, they will be recreated next time they are required
  function makeMediaThumbs(slugFolderName, slugMediaName, meta) {
    return new Promise(function(resolve, reject) {
      dev.logfunction(`THUMBS — makeMediaThumbs — Making thumbs for media with meta: ${JSON.stringify(meta, null, 4)}`);

      let thumbFolderPath = path.join(local.settings().thumbFolderName, slugFolderName);
      let mediaPath = path.join(_getFolderPath(slugFolderName), slugMediaName);

      // let’s make sure that our thumb folder exists first
      fs.mkdirp(_getFolderPath(thumbFolderPath), function (err) {
        if (err) { reject(err); }

        // regroup all thumbs promises so they can happen as fast as possible
        let makeThumbs = [];

        if(meta.type === 'image') {
          let thumbResolutions = [200,600,1800];
          thumbResolutions.forEach((thumbRes) => {
            let makeThumb = new Promise((resolve, reject) => {
              _makeImageThumb(mediaPath, thumbFolderPath, slugMediaName, thumbRes).then((thumbPath) => {
                let thumbMeta = {
                  path: thumbPath,
                  size: thumbRes
                };
                resolve(thumbMeta);
              })
              .catch(err => {
                resolve();
              });
            });
            makeThumbs.push(makeThumb);
          });
        }

        if(meta.type === 'video') {
          ffmpeg(mediaPath)
            // setup event handlers
            .on('end', function(files) {
              dev.logverbose(`Screenshots were saved : ${JSON.stringify(files,null,4)}`);
/*
              let thumbMeta = {
                path: thumbPath,
                size: thumbRes
              };
              resolve(thumbMeta);
*/
            })
            .on('error', function(err) {
              dev.error(`An error happened: ${err.message}`);
              reject(err.message);
            })
            .screenshots({
              count: 1,
              timemarks: ['00:00:00'],
              filename: `${slugMediaName}.%s.jpeg`,
              folder: _getFolderPath(thumbFolderPath)
            });
        }

        Promise.all(makeThumbs).then((thumbData) => {
          resolve(thumbData);
        });
      });
    });
  }

  function readEXIFData(mediaPath) {
    return new Promise(function(resolve, reject) {
      dev.logfunction(`THUMBS — readEXIFData — for: ${JSON.stringify(mediaPath, null, 4)}`);

      sharp(mediaPath)
        .metadata()
        .then((metadata) => resolve(metadata))
        ;
    });
  }

  function _getFolderPath(slugFolderName = '') {
    return path.join(_getUserPath(), slugFolderName);
  }
  function _getUserPath() {
    return global.pathToUserContent;
  }

  function _makeImageThumb(mediaPath, thumbFolderPath, slugMediaName, thumbRes) {
    return new Promise(function(resolve, reject) {
      dev.logverbose(`Making an image thumb for ${mediaPath} and resolution = ${thumbRes}`);

      let thumbName = `${slugMediaName}.${thumbRes}.jpeg`;
      let thumbPath = path.join(thumbFolderPath, thumbName);
      let fullThumbPath = _getFolderPath(thumbPath);

      // check first if it exists, resolve if it does
      fs.access(fullThumbPath, fs.F_OK, function(err) {
        // if userDir folder doesn't exist yet at destination
        if(err) {
          sharp(mediaPath)
            .rotate()
            .resize(thumbRes, thumbRes)
            .max()
            .withoutEnlargement()
            .withMetadata()
            .toFormat('jpeg', {
              quality: local.settings().mediaThumbQuality
            })
            .toFile(fullThumbPath)
            .then(function() {
              resolve(thumbPath);
            })
            .catch(err => reject());

        } else {
          resolve(thumbPath);
        }
      });
    });
  }
  return API;
})();
