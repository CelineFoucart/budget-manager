'use strict'

import { app, protocol, BrowserWindow, ipcMain, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')
const fs = require('fs')
const os = require("os");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1024,
		height: 720,
		minWidth: 900,
		minHeight: 600,
		frame: false,
		closable: true,
		backgroundColor: '#f8f9fc',
		icon: path.join(__dirname, '../build/icon.ico'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: false,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
		}
	})

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
		if (!process.env.IS_TEST) win.webContents.openDevTools()
	} else {
		createProtocol('app')
		// Load the index.html when not in development
		win.loadURL('app://./index.html')
	}
	
    ipcMain.on('reduceApp', () => {
        win.minimize();
    })

    ipcMain.on('sizeApp', () => {
        if (win.isMaximized()) {
            win.restore();
        } else {
            win.maximize();
        }
    })

    ipcMain.on('on-reload', () => {
        win.reload();
    })

	// handle export to PDF
	ipcMain.on('exportPdf', (e, filename) => {
		console.log(os.homedir())
		var filepath = path.join(os.homedir(), 'Documents/' + filename + '.pdf');
		// Options du PDF
		var options = {
			marginsType: 1,
			pageSize: 'A4',
			printBackground: true,
			printSelectionOnly: false,
			landscape: false
		}
		
		win.webContents.printToPDF(options).then(data => {
			fs.writeFile(filepath, data, function (err) {
				if (err) {
					console.log(err);
				} else {
					shell.showItemInFolder(filepath); 
					shell.openPath(filepath);
				}
			});
		}).catch(error => {
			console.log(error)
		});
	})
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS3_DEVTOOLS)
		} catch (e) {
			console.error('Vue Devtools failed to install:', e.toString())
		}
	}
	createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit()
			}
		})
	} else {
		process.on('SIGTERM', () => {
			app.quit()
		})
	}
}

ipcMain.on('closeApp', () => {
	app.exit()
})

// set up database if it is empty
if (fs.existsSync(`data/categories.db`) === false) {
    const Datastore = require('@seald-io/nedb');
    const db = new Datastore({ filename: 'data/categories.db', autoload: true });
    db.insert([{name: 'alimentaire'}, {name: 'salaires'}, {name: 'charges'}]);
}
