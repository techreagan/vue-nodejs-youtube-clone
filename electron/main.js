// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, Tray} = require('electron');
const path = require('path');
const {ipcMain} = require('electron');
const {run} = require('./utils');
// const fs = require('fs');

// app.disableHardwareAcceleration();

let win;
let tray;
let workerProcess;
let logs = [];

function quit(status = true) {
    workerProcess.kill();
    if (status) app.quit();
}

async function createWindow() {
    Menu.setApplicationMenu(null);

    // Create the browser window.
    win = new BrowserWindow({
        show: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false,
        },
    });

    win.webContents.on('did-finish-load', () => {
        win.isStart = true;
    });

    workerProcess = await run({win, logs});

    // Create the menu
    tray = new Tray('./public/favicon.png'); // sets tray icon image
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Restart',
            click: async () => {
                quit(false);
                logs = [];
                win.webContents.send('logs', logs);
                win.webContents.send('startLoading');
                workerProcess = await run({win, logs});
            }, // click event
        },
        {
            label: 'Exit',
            click: () => {
                quit();
            },
        },
    ]);
    tray.setContextMenu(contextMenu);

    // and load the index.html of the app.
    if(process.env.TERGET_ENV){
        win.loadURL("http:localhost:8080")
    }
    else {
        win.loadFile('./dist/index.html');
    }

    win.webContents.addListener(
        'new-window',
        (event, url) => {
            event.preventDefault();
            let openWin = new BrowserWindow({
                webPreferences: {
                    preload: path.join(__dirname, 'preload.js'),
                    webSecurity: false,
                },
            });
            openWin.loadURL(url);
            openWin.webContents.session.addListener(
                'will-download',
                () => {
                    openWin.destroy();
                },
            );
        },
    );

    win.maximize();
    win.show();

    // Open the DevTools.

    process.env.TERGET_ENV && win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        quit();
    }
});

ipcMain.on('restart', async () => {
    quit(false);
    logs = [];
    win.webContents.send('logs', logs);
    win.webContents.send('startLoading');
    workerProcess = await run({win, logs});
});

// ipcMain.on('config', (event) => {
//   fs.readFile('./aurora/aurora.yaml', 'utf-8', function (err, data) {
//     event.reply('config', { err, data });
//   });
// });

// ipcMain.on('save', (event, message) => {
//   fs.writeFile('./aurora/aurora.yaml', message, (err, data) => {
//     event.reply('save', { err, data });
//   });
// });

// ipcMain.on('reset', (event) => {
//   fs.readFile('./aurora/.aurora', 'utf-8', function (err, data) {
//     event.reply('reset', { err, data });
//   });
// });

// ipcMain.on('logs', (event) => {
//   event.reply('logs', logs);
// });
