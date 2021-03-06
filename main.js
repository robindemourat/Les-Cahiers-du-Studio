const electron = require('electron');
const {app, BrowserWindow, Menu} = electron;

const path = require('path');
const fs = require('fs-extra');
const flags = require('flags');
const {dialog} = require('electron');
const JSONStorage = require('node-localstorage').JSONStorage;
const portscanner = require('portscanner');

const server = require('./server');

const
  local  = require('./local'),
  config = require('./config.json'),
  dev = require('./bin/dev-log')
;

let win;
app.commandLine.appendSwitch('--ignore-certificate-errors');
app.commandLine.appendSwitch('--disable-http-cache');

function createWindow() {

  console.log(process.versions);

  var storageLocation = app.getPath('userData');
  global.nodeStorage = new JSONStorage(storageLocation);

  flags.defineBoolean('debug');
  flags.defineBoolean('verbose');
  flags.parse();

  const debug = flags.get('debug');
  const verbose = flags.get('verbose');
  dev.init(debug, verbose);

  if( global.appInfos === undefined) {
    global.appInfos = {};
  }

  global.appInfos.version = app.getVersion();
  let pathToPresentationMd = path.join(`${__dirname.replace(`${path.sep}app.asar`, '')}`, `${local.settings().contentDirname}`, `presentation.md`);
  global.appInfos.presentationMd = fs.readFileSync(pathToPresentationMd, local.settings().textEncoding);

  dev.log(`——— Starting les-cahiers app version ${global.appInfos.version}`);

  var windowState = {};
  try {
    windowState = global.nodeStorage.getItem('windowstate') ? global.nodeStorage.getItem('windowstate') : {};
    dev.log('Found defaults for windowState: ');
    dev.log(windowState);
  } catch (err) {
    dev.log('No default for windowState');
  }

  // Create the browser window.
  win = new BrowserWindow({
    x: windowState.bounds && windowState.bounds.x || undefined,
    y: windowState.bounds && windowState.bounds.y || undefined,
    width: windowState.bounds && windowState.bounds.width || 1200,
    height: windowState.bounds && windowState.bounds.height || 800,

    backgroundColor: '#333',
    show: false,
    titleBarStyle: 'hidden',

    webPreferences: {
      allowDisplayingInsecureContent: true,
      allowRunningInsecureContent: true,
      nodeIntegration: true
    }
  });

  if (windowState.isMaximized) {
    win.maximize();
  }

  var storeWindowState = function() {
    windowState.isMaximized = win.isMaximized();
    if (!windowState.isMaximized) {
      // only update bounds if the window isn't currently maximized
      windowState.bounds = win.getBounds();
    }
    global.nodeStorage.setItem('windowstate', windowState);
  };

  ['resize', 'move', 'close'].forEach(function(e) {
    win.on(e, function() {
      try {
        storeWindowState();
      } catch(e) {
        dev.error('Couldn’t update local settings with window position: ' + e);
      }
    });
  });

  setApplicationMenu();

  copyAndRenameUserFolder().then(function(pathToUserContent) {

    global.pathToUserContent = pathToUserContent;
    dev.log('Will store contents in: ' + global.pathToUserContent);

    portscanner.findAPortNotInUse(config.port, config.port + 20).then((port) => {

      dev.log(`main.js - Found available port: ${port}`);
      global.appInfos.port = port;
      global.appInfos.homeURL = `${config.protocol}://${config.host}:${global.appInfos.port}`;

      app.server = server(app);

      // and load the base url of the app.
      win.loadURL(global.appInfos.homeURL);

      if(dev.isDebug() || global.nodeStorage.getItem('logToFile')) {
        win.webContents.openDevTools();
      }
    }, function(err) {
      dev.error( 'Failed to find available port: ' + err);
      dialog.showErrorBox(`L’application Les Cahiers du Studio n’as pas pu démarrer`, `Il semble que les ports ${config.port} jusqu’à ${config.port + 20} ne soient pas disponibles.\nCode de l’erreur: ${err}`);
    });

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null;
    });

    win.on('ready-to-show', function() {
      win.show();
      win.focus();
    });

  }, function(err) {
    dev.error( 'Failed to check existing content folder : ' + err);
  });

}

function setApplicationMenu() {
  // Create the Application's main menu
  var template = [{
    label: 'Electron',
    submenu: [
      {
        label: 'About Electron',
        selector: 'orderFrontStandardAboutPanel:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide Electron',
        accelerator: 'Command+H',
        selector: 'hide:'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      },
      {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() { app.quit(); }
      },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      },
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'Command+R',
        click: function() { BrowserWindow.getFocusedWindow().reload(); }
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
      },
    ]
  },
  {
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      },
      {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      },
    ]
  },
  {
    label: 'Help',
    submenu: []
  }];

  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
function copyAndRenameUserFolder() {
  return new Promise(function(resolve, reject) {

    // check if nodeStorage has a userDirPath field
    let userDirPath = '';
    try {
      userDirPath = global.nodeStorage.getItem('userDirPath');
      dev.log(`global.nodeStorage.getItem('userDirPath') : ${global.nodeStorage.getItem('userDirPath')}`);
    } catch (err) {
      dev.log('Fail loading node storage for userDirPath');
      // the file is there, but corrupt. Handle appropriately.
    }

    // if it has an empty userDirPath
    if(userDirPath === '') {
      dev.log('Missing path to content folder');
      try {
        userDirPath = dialog.showOpenDialog({
          title: 'Select the folder which will contain all the medias and the informations added.',
          defaultPath: app.getPath('documents'),
          properties: ['openDirectory']
        })[0];
        dev.log('A path was picked: ' + userDirPath);
      } catch(err){
        dev.log('Cancel was click, not path selected. Settings userDirPath back to default.');
        userDirPath = app.getPath(config.userDirPath);
      }
      global.nodeStorage.setItem('userDirPath', userDirPath);
    }

    // if it has a non-empty userDirPath, lets use it
    else if(userDirPath !== null && userDirPath.length > 0) {
      dev.log('Found usable userDirPath:' + userDirPath);
    }

    // if it doens't have a userDirPath
    else {
      dev.log('No usable userDirPath, using default');
      userDirPath = app.getPath(config.userDirPath);
    }

    const pathToUserContent = path.join(userDirPath, config.userDirname);

    fs.access(pathToUserContent, fs.F_OK, function(err) {
      // if userDir folder doesn't exist yet at destination
      if(err) {
        dev.log('Content folder ' + config.userDirname + ' does not already exists in ' + userDirPath);
        dev.log(`->duplicating /${local.settings().contentDirname} to create a new one`);
        const sourcePathInApp = path.join(`${__dirname.replace(`${path.sep}app.asar`, '')}`, `${local.settings().contentDirname}`);
        fs.copy(sourcePathInApp, pathToUserContent, function (err) {
          if(err) {
            dev.error('failed to copy: ' + err);
            reject(err);
          }
          resolve(pathToUserContent);
        });
      } else {
        dev.log('Content folder ' + config.userDirname + ' already exists in ' + userDirPath);
        dev.log('->not creating a new one');
        resolve(pathToUserContent);
      }
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
    app.quit();
  // }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

