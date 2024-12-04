/* eslint-disable @typescript-eslint/no-var-requires */
// Electron doesnt support ESM for renderer process. Alternatively, pass this file
// through a bundler but that feels like an overkill

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
	ipcAPI: {
		send: (channel: string, data?: unknown) => ipcRenderer.send(channel, data),
		on: (
			channel: string,
			listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
		) => ipcRenderer.on(channel, listener),
		invoke: (channel: string, data?: unknown) =>
			ipcRenderer.invoke(channel, data),
	},
})
