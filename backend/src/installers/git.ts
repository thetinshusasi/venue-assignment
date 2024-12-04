import { dialog } from 'electron'
import * as path from 'path'
import * as os from 'os'
import { promises as fs } from 'fs'
import { exec } from 'child_process'
import { downloadFile, isGitInstalled } from '../common/utils'
import { IPlatformEnum } from '../models/enums/IPlatformEnum'
import { LOCAL_GIT_REPO_PATH } from '../common/constants'

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

export const installGit = async (): Promise<void> => {
	const platform = os.platform()

	try {
		switch (platform) {
			case IPlatformEnum.WINDOWS:
				return windowsInstaller()

			case IPlatformEnum.MAC:
				// macOS
				return macInstaller()

			case IPlatformEnum.LINUX:
				// Linux
				return linuxInstaller()

			default:
				dialog.showErrorBox(
					'Unsupported Platform',
					`Git installation is not supported on ${platform}.`
				)
				break
		}
		return
	} catch (error) {
		dialog.showErrorBox(
			'Error',
			`Failed to install Git: ${(error as Error).message}`
		)
	}
}

export const ensureAppDataFolderExists = async (): Promise<void> => {
	// Define the target folder path

	try {
		// Check if the folder exists
		await fs.access(LOCAL_GIT_REPO_PATH)
		console.log('Folder already exists:', LOCAL_GIT_REPO_PATH)
	} catch {
		// Folder does not exist, so create it
		await fs.mkdir(LOCAL_GIT_REPO_PATH, { recursive: true })
		console.log('Folder created:', LOCAL_GIT_REPO_PATH)
	}
}

export const checkAndInstallGit = async (): Promise<void> => {
	await ensureAppDataFolderExists()

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
