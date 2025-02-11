const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electronAPI', { // Exposed as `electronAPI` in the renderer
    quitApp: () => ipcRenderer.send('quit-app')
  }
);
