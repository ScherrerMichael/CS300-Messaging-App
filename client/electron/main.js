const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev');
const path = require('path');
const { start } = require('repl');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#3c3cd',
    minHeight: 450,
    minWidth:  900,
    // webPreferences: {
    //   preload: path.join(__dirname, 'preload.js')
    // }
  })

  //win.setMenuBarVisibility(false)

  const startURL = isDev? `http:///localhost:3000` : `${path.join(__dirname, '..\\build\\index.html')}`;

  win.loadURL(startURL)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})