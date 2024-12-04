import { app, BrowserWindow, dialog } from 'electron'
import log from 'electron-log'
import electronUpdater from 'electron-updater'
import electronIsDev from 'electron-is-dev'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import 'dotenv/config'

import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { checkAndInstallGit } from './installers/git'
import { IPlatformEnum } from './models/enums/IPlatformEnum'
import { initiateIPCEventRegisteration } from './ipc/event-listeners/git-events'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { autoUpdater } = electronUpdater
let appWindow: BrowserWindow | null = null
// eslint-disable-next-line @typescript-eslint/no-unused-vars

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info'
		autoUpdater.logger = log
		autoUpdater.checkForUpdatesAndNotify()
	}
}

const installExtensions = async () => {
	/**
	 * NOTE:
	 * As of writing this comment, Electron does not support the `scripting` API,
	 * which causes errors in the REACT_DEVELOPER_TOOLS extension.
	 * A possible workaround could be to downgrade the extension but you're on your own with that.
	 */
	/*
	const {
		default: electronDevtoolsInstaller,
		//REACT_DEVELOPER_TOOLS,
		REDUX_DEVTOOLS,
	} = await import('electron-devtools-installer')
	// @ts-expect-error Weird behaviour
	electronDevtoolsInstaller.default([REDUX_DEVTOOLS]).catch(console.log)
	*/
}

const spawnAppWindow = async () => {
	if (electronIsDev) await installExtensions()

	const RESOURCES_PATH = electronIsDev
		? path.join(__dirname, '../../assets')
		: path.join(process.resourcesPath, 'assets')

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths)
	}

	// const PRELOAD_PATH = path.join(__dirname, 'preload.js')

	appWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: getAssetPath('icon.png'),
		show: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	})

	appWindow.loadURL(
		electronIsDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../../frontend/build/index.html')}`
	)
	appWindow.maximize()
	appWindow.setMenu(null)
	appWindow.show()

	if (electronIsDev) appWindow.webContents.openDevTools({ mode: 'right' })

	appWindow.on('closed', () => {
		appWindow = null
	})
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
