import { ipcMain, dialog, app } from 'electron'
import log from 'electron-log'

export function createBridge({ serverPort }: { serverPort: number }) {
  ipcMain.handle('readServerUrl', async () => {
    return `http://localhost:${serverPort}`
  })
  ipcMain.handle('sendFatalError', async (_ev, message: string) => {
    log.error(message)
    app.quit()
  })
  ipcMain.handle('openDirectoryDialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Select a folder',
      properties: ['openDirectory'],
    })
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  })
}
