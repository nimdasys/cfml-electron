const {
    app,
    BrowserWindow
} = require('electron')
const is = require("electron-is")
const exec = require('child_process').exec

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Make sure this port matches the server.json port
const commandbox_port = 8888

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    startCommandBox()
    createWindow()
})

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
    if (win === null) {
        createWindow()
    }
})

app.on('before-quit', () => {
    stopCommandBox()
})

function createWindow() {

    require('find-java-home')(function(err, home){
        if(err)return console.log(err);
        console.log(home);
    });

    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    setTimeout(function() {
        win.loadURL('http://localhost:'+commandbox_port+'/')
    }, 15000);

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

function startCommandBox() {
    require('find-java-home')(function(err, home){
        if(err)return console.log(err);

        if (is.windows()) {
            var java_path = home + '\\bin\\java';
            var cfml_path = app.getAppPath() + '\\cfml';
            var box_path = app.getAppPath() + '\\commandbox\\box.jar';
        } else {
            var java_path = home + '/bin/java';
            var cfml_path = app.getAppPath() + '/cfml';
            var box_path = app.getAppPath() + '/commandbox/box.jar';
        }

        var cmd = `cd "${cfml_path}" && "${java_path}" -jar "${box_path}" server start`;

        execute(cmd, (output) => {
            console.log(output)
        })
    });
}

function stopCommandBox() {
    require('find-java-home')(function(err, home){
        if(err)return console.log(err);

        if (is.windows()) {
            var java_path = home + '\\bin\\java';
            var cfml_path = app.getAppPath() + '\\cfml';
            var box_path = app.getAppPath() + '\\commandbox\\box.jar';
        } else {
            var java_path = home + '/bin/java';
            var cfml_path = app.getAppPath() + '/cfml';
            var box_path = app.getAppPath() + '/commandbox/box.jar';
        }

        var cmd = `cd "${cfml_path}" && "${java_path}" -jar "${box_path}" server stop`;

        execute(cmd, (output) => {
            console.log(output)
        })
    });
}

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => { 
        if( error ) callback(error)
        if( stderr ) callback(stderr)
        if( stdout ) callback(stdout)
    })
}
