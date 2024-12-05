import { ipcMain } from 'electron'
import {
	GIT_CLONE_EVENT,
	GIT_LOCAL_REPO_LIST,
	DELETE_REPO_BY_NAME,
} from '../event-constants'
import {
	gitCloneEventHandler,
	getLocalRepoList,
	deleteRepoByName,
} from '../event-handlers/git-event-handlers'

export const initiateIPCEventRegisteration = () => {
	ipcMain.handle(GIT_CLONE_EVENT, gitCloneEventHandler)
	ipcMain.handle(GIT_LOCAL_REPO_LIST, getLocalRepoList)
	ipcMain.handle(DELETE_REPO_BY_NAME, deleteRepoByName)

	console.log('IPC event registered')
}
