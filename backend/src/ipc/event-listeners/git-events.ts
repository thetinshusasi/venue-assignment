import { ipcMain } from 'electron'
import {
	GIT_CLONE_EVENT,
	GIT_LOCAL_REPO_LIST,
	DELETE_REPO_BY_NAME,
	OPEN_LOCAL_REPO,
	READ_LOCAL_DIRECTORY,
	READ_FILE_IN_LOCAL_REPO,
} from '../event-constants'
import {
	gitCloneEventHandler,
	getLocalRepoList,
	deleteRepoByName,
	openLocalRepo,
	readLocalDirectory,
	readFileInLocalRepo,
} from '../event-handlers/git-event-handlers'

export const initiateIPCEventRegisteration = () => {
	ipcMain.handle(GIT_CLONE_EVENT, gitCloneEventHandler)
	ipcMain.handle(GIT_LOCAL_REPO_LIST, getLocalRepoList)
	ipcMain.handle(DELETE_REPO_BY_NAME, deleteRepoByName)
	ipcMain.handle(OPEN_LOCAL_REPO, openLocalRepo)
	ipcMain.handle(READ_LOCAL_DIRECTORY, readLocalDirectory)
	ipcMain.handle(READ_FILE_IN_LOCAL_REPO, readFileInLocalRepo)
	console.log('IPC event registered')
}
