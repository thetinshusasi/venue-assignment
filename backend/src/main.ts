import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import log from 'electron-log'
import electronUpdater from 'electron-updater'
import electronIsDev from 'electron-is-dev'
import ElectronStore from 'electron-store'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import 'dotenv/config'

import { exec } from 'child_process'
import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

/* Todo: Writing backend code here due to tsconfig issue : Unable to import esm modules
 * ======================================================================================
 *                                User Code
 * ======================================================================================
 *
 */

const isGitInstalled = async (): Promise<boolean> => {
	return new Promise(resolve => {
		exec('git --version', error => {
			resolve(!error) // If no error, Git is installed
		})
	})
}

const downloadFile = async (url: string, outputPath: string): Promise<void> => {
	const writer = fs.createWriteStream(outputPath)
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream',
	})

	response.data.pipe(writer)

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve)
		writer.on('error', reject)
	})
}

const windowsInstaller = async (): Promise<void> => {
	// Windows
	const winLocation = process.env.WIN_INSTALLER_LOCATION || ''

	if (!winLocation) {
		dialog.showErrorBox(
			'Error',
			`Git installation failed: Windows location not set in env file`
		)
		return
	}

	const winInstallerUrl = process.env.WIN_DOWNLOAD_URL || ''

	if (!winInstallerUrl) {
		dialog.showErrorBox(
			'Error',
			`Git installation failed: Windows URL not set in env file`
		)
		return
	}

	const DOWNLOAD_DIR = path.join(os.tmpdir(), winLocation)

	const installerPath = path.join(DOWNLOAD_DIR, 'GitInstaller.exe')
	await downloadFile(winInstallerUrl, installerPath)

	// Run the installer silently
	exec(`start "" /wait "${installerPath}" /SILENT`, error => {
		if (error) {
			dialog.showErrorBox('Error', `Git installation failed: ${error.message}`)
		} else {
			dialog.showMessageBox({ message: 'Git installed successfully!' })
		}
	})
	return
}

const macInstaller = async (): Promise<void> => {
	exec('xcode-select --install', error => {
		if (error) {
			dialog.showErrorBox('Error', `Git installation failed: ${error.message}`)
		} else {
			dialog.showMessageBox({
				message: 'Git installed successfully via Xcode Command Line Tools!',
			})
		}
	})
	return
}

const linuxInstaller = async (): Promise<void> => {
	exec('sudo apt-get update && sudo apt-get install git -y', error => {
		if (error) {
			dialog.showErrorBox('Error', `Git installation failed: ${error.message}`)
		} else {
			dialog.showMessageBox({ message: 'Git installed successfully!' })
		}
	})
	return
}

const installGit = async (): Promise<void> => {
	const platform = os.platform()

	try {
		if (platform === 'win32') {
			return windowsInstaller()
		}
		if (platform === 'darwin') {
			// macOS

			return macInstaller()
		}
		if (platform === 'linux') {
			// Linux

			return linuxInstaller()
		}
		dialog.showErrorBox(
			'Unsupported Platform',
			`Git installation is not supported on ${platform}.`
		)

		return
	} catch (error) {
		dialog.showErrorBox(
			'Error',
			`Failed to install Git: ${(error as Error).message}`
		)
	}
}

const checkAndInstallGit = async (): Promise<void> => {
	const gitInstalled = await isGitInstalled()
	if (gitInstalled) {
		// dialog.showMessageBox({
		// 	message: 'Prerequisite: Git is already installed!',
		// })

		console.log('Prerequisite: Git is already installed!')
		return
	}
	dialog.showMessageBox({
		message: 'Git is not installed. Proceeding with installation...',
	})
	await installGit()
}

/*
 * ======================================================================================
 *                                    User Code
 * ======================================================================================
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { autoUpdater } = electronUpdater
let appWindow: BrowserWindow | null = null
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const store = new ElectronStore()

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

	const PRELOAD_PATH = path.join(__dirname, 'preload.js')

	appWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: getAssetPath('icon.png'),
		show: false,
		webPreferences: {
			preload: PRELOAD_PATH,
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

	if (platform === 'win32') {
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

ipcMain.handle('sample:ping', () => {
	return 'pong'
})
