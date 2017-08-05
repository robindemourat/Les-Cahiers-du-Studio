import Vue from 'vue/dist/vue';

import io from 'socket.io-client';
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

/***********
   STOREJS
***********/

window.store = {
  debug:true,
  state: {},
};
window.store.state.folders = JSON.parse(JSON.stringify(locals.data));

/***********
  SOCKETIO
***********/

window.socketio = (function() {
  let socket;

  const API = {
    init        : () => { return init(); },
    listMedias  : (slugFolderName) => { return listMedias(slugFolderName); },
    createFolder: (fdata) => { return createFolder(fdata); },
  };

  function init() {
    socket = io.connect();
    	socket.on('connect', _onSocketConnect);
    socket.on('error', _onSocketError);
    	socket.on('listMedias', _onListMedias);
    	socket.on('listFolder', _onListFolder);
    	socket.on('mediaCreated', _onMediaCreated);
  }

  function listMedias(slugFolderName) {
    socket.emit('listMedias', { slugFolderName });
  }
  function createFolder(fdata) {
    socket.emit('createFolder', fdata);
  }

  function _onSocketConnect() {
    	let sessionId = socket.io.engine.id;
    	console.log(`Connected as ${sessionId}`);
  }
  function _onSocketError(reason) {
    	console.log(`Unable to connect to server: ${reason}`);
  	}
  function _onListMedias(mdata) {
    let slugFolderName = Object.keys(mdata)[0];
    window.store.state.folders[slugFolderName].medias = mdata[slugFolderName].medias;
  }
  function _onListFolder(fdata) {
    window.store.state.folders = Object.assign({}, window.store.state.folders, fdata);
  }
  function _onMediaCreated(mdata) {
    let slugFolderName = Object.keys(mdata)[0];
    let createdMediaMeta = mdata[slugFolderName].medias;
    // to get Vue to detect that medias has a new key, we need to rewrite medias itself
    window.store.state.folders[slugFolderName].medias = Object.assign({}, window.store.state.folders[slugFolderName].medias, createdMediaMeta);
    return;
  }

  return API;
})();
socketio.init();

/***********
  UTILS
***********/

$.extend($.easing,{
  easeInOutQuint: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) { return c/2*t*t*t*t*t + b; }
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  }
});

// If click on a link with a specific class, open in the browser and not in electron.
$('body').on('click', '.js--openInBrowser', function() {
/*
  if(require('electron') !== undefined) {
    var shell = require('electron').shell;
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
*/
});

/***********
  VUE
***********/
Vue.config.silent = false;
Vue.config.devtools = true;
import App from './App.vue';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});

