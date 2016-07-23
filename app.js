'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const dialog = electron.dialog

let mainWindow

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600
    })
    mainWindow.loadURL(`file://${__dirname}/views/index.html`)
    // mainWindow.openDevTools()
    mainWindow.on('closed', () => mainWindow=null)
}

app.on('ready', createWindow)
app.on('windows-all-closed', () => process.platform!=='darwin' ? app.quit():undefined)
app.on('active', () => mainWindow===null ? createWindow():undefined)

ipc.on('alert-change-dialog', (event) => {
    const options = {
        type: 'info',
        title: 'Information',
        message: 'Item changed',
        buttons: ['OK']
    }

    dialog.showMessageBox(options, (event) => {
      event.sender.send('next-request')
    })
})
