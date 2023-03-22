/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Database from 'better-sqlite3';
import { IPoverka } from 'renderer/components/NeedPoverka/NeedPoverka';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
console.log(path.join(__dirname, 'db.db'));
const db = new Database(path.join(__dirname, 'db.db'), {
  verbose: console.log,
});

ipcMain.on('Login', async (e, arg) => {
  const row = db
    .prepare('SELECT id, role FROM users WHERE login = ? AND password = ?')
    .get(arg[0], arg[1]);
  e.reply('Login', row);
});

ipcMain.on('GetOilObjects', async (e) => {
  const rows = db.prepare('SELECT * FROM OilObjects').all();
  rows.forEach((row) => {
    const devices = db
      .prepare(
        'SELECT Devices.id as id, title FROM OilDevice JOIN Devices ON Devices.id = OilDevice.Device WHERE OilObject = ?'
      )
      .all(row.id);
    row.devices = [];
    row.devicesTitles = [];
    devices.forEach((dev) => {
      row.devices.push(dev.id);
      row.devicesTitles.push(dev.title);
    });
  });

  e.reply('GetOilObjects', rows);
});

ipcMain.on('AddOilObject', async (e, arg) => {
  const res = db
    .prepare('INSERT INTO OilObjects (title, address) VALUES(?, ?)')
    .run(arg[0].title, arg[0].address);
  arg[0].devices.forEach((dev: number) => {
    db.prepare('INSERT INTO OilDevice (OilObject, Device) VALUES(?, ?)').run(
      res.lastInsertRowid,
      dev
    );
  });
});

ipcMain.on('RemoveOilObjects', async (e, arg) => {
  db.prepare('DELETE FROM OilObjects WHERE id = ?').run(arg[0]);
});

ipcMain.on('GetDevices', async (e) => {
  const rows = db
    .prepare(
      'SELECT Devices.id as id, Devices.title as title, period, DevicesTypes.title as typeTitle FROM Devices JOIN DevicesTypes ON Devices.type = DevicesTypes.id'
    )
    .all();
  e.reply('GetDevices', rows);
});

ipcMain.on('AddDevice', async (e, arg) => {
  db.prepare('INSERT INTO Devices (title, type, period) VALUES(?, ?, ?)').run(
    arg[0].title,
    arg[0].type,
    arg[0].period
  );
});

ipcMain.on('EditDevice', async (e, arg) => {
  db.prepare(
    'UPDATE Devices SET title = ?, type = ?, period = ? WHERE id = ?'
  ).run(arg[0].title, arg[0].type, arg[0].period, arg[0].id);
});

ipcMain.on('EditOilObject', async (e, arg) => {
  db.prepare('UPDATE OilObjects SET title = ?, address = ?  WHERE id = ?').run(
    arg[0].title,
    arg[0].address,
    arg[0].id
  );
  db.prepare('DELETE FROM OilDevice WHERE OilObject = ?').run(arg[0].id);

  arg[0].devices.forEach((dev: number) => {
    db.prepare('INSERT INTO OilDevice (OilObject, Device) VALUES(?, ?)').run(
      arg[0].id,
      dev
    );
  });
});

ipcMain.on('RemoveDevices', async (e, arg) => {
  db.prepare('DELETE FROM Devices WHERE id = ?').run(arg[0]);
});

ipcMain.on('RemoveServices', async (e, arg) => {
  db.prepare('DELETE FROM Services WHERE id = ?').run(arg[0]);
});

ipcMain.on('GetServices', async (e) => {
  const rows = db.prepare('SELECT * FROM Services').all();
  e.reply('GetServices', rows);
});

ipcMain.on('AddService', async (e, arg) => {
  db.prepare('INSERT INTO Services (title) VALUES(?)').run(arg[0].title);
});

ipcMain.on('EditService', async (e, arg) => {
  db.prepare('UPDATE Services SET title = ?  WHERE id = ?').run(
    arg[0].title,
    arg[0].id
  );
});

ipcMain.on('RemoveDevicesTypes', async (e, arg) => {
  db.prepare('DELETE FROM DevicesTypes WHERE id = ?').run(arg[0]);
});

ipcMain.on('GetDevicesTypes', async (e) => {
  const rows = db.prepare('SELECT * FROM DevicesTypes').all();
  e.reply('GetDevicesTypes', rows);
});

ipcMain.on('AddDevicesTypes', async (e, arg) => {
  db.prepare('INSERT INTO DevicesTypes (title) VALUES(?)').run(arg[0].title);
});

ipcMain.on('EditDevicesTypes', async (e, arg) => {
  db.prepare('UPDATE DevicesTypes SET title = ?  WHERE id = ?').run(
    arg[0].title,
    arg[0].id
  );
});

ipcMain.on('GetPoverka', async (e) => {
  const rows = db
    .prepare(
      `SELECT Poverka.id as id, date, nextDate, device, Devices.title as deviceTitle, DevicesTypes.title as typeTitle, place, org, Services.title as orgTitle, result, employee, users.fio as employeeFIO, oilObject, oilObjects.title as oilObjectTitle FROM Poverka 
        JOIN Devices ON Devices.id = device
        JOIN DevicesTypes ON DevicesTypes.id = Devices.type
        JOIN users ON users.id = employee
        JOIN OilObjects ON OilObjects.id = oilObject
        JOIN Services ON Services.id = org
      ORDER BY nextDate desc`
    )
    .all();
  e.reply('GetPoverka', rows);
});

ipcMain.on('RemovePoverka', async (e, arg) => {
  db.prepare('DELETE FROM Poverka WHERE id = ?').run(arg[0]);
});

ipcMain.on('AddPoverka', async (_, arg) => {
  const form = arg[0] as IPoverka;
  db.prepare(
    'INSERT INTO Poverka (date, type, place, org, result, nextDate, employee, device, oilObject) VALUES (?,?,?,?,?,?,?,?,?)'
  ).run(
    form.date,
    form.type,
    form.place,
    form.org,
    form.result,
    form.nextDate,
    form.employee,
    form.device,
    form.oilObject
  );
});

ipcMain.on('EditPoverka', async (e, arg) => {
  const form = arg[0] as IPoverka;
  db.prepare(
    'UPDATE Poverka SET date = ?, type = ?, place = ?, org = ?, result = ?, nextDate = ?, employee = ?, device = ?, oilObject = ?  WHERE id = ?'
  ).run(
    form.date,
    form.type,
    form.place,
    form.org,
    form.result,
    form.nextDate,
    form.employee,
    form.device,
    form.oilObject,
    form.id
  );
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1366,
    height: 768,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    db.close();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
