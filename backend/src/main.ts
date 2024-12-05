import { app, dialog } from 'electron'
import log from 'electron-log'
import electronUpdater from 'electron-updater'

import 'dotenv/config'

import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { checkAndInstallGit } from './installers/git'
import { IPlatformEnum } from './models/enums/IPlatformEnum'
import { initiateIPCEventRegisteration } from './ipc/event-listeners/git-events'
import { spawnAppWindow } from './window'

const { autoUpdater } = electronUpdater
class AppUpdater {
	constructor() {
		log.transports.file.level = 'info'
		autoUpdater.logger = log
		autoUpdater.checkForUpdatesAndNotify()
	}
}

app.on('ready', async () => {
	const platform = os.platform()

	if (platform === IPlatformEnum.WINDOWS) {
		const winLocation = process.env.WIN_INSTALLER_LOCATION || ''
		if (!winLocation) {
			dialog.showErrorBox(
				'Error',
				`Git installation failed: Windows location not set in env file`
			)
			return
		}

		const DOWNLOAD_DIR = path.join(os.tmpdir(), winLocation)

		if (!fs.existsSync(DOWNLOAD_DIR)) {
			fs.mkdirSync(DOWNLOAD_DIR, { recursive: true })
		}
	}

	await checkAndInstallGit()
	new AppUpdater()
	spawnAppWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

/*
 * ======================================================================================
 *                                IPC Main Events
 * ======================================================================================
 */

initiateIPCEventRegisteration()
console.log('All events registered')
