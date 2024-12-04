import { ipcMain } from 'electron'
import { GIT_CLONE_EVENT } from '../event-constants'
import { gitCloneEventHandler } from '../event-handlers/git-event-handlers'

export const initiateIPCEventRegisteration = () => {
	ipcMain.handle(GIT_CLONE_EVENT, gitCloneEventHandler)

	console.log('IPC event registered')
}
