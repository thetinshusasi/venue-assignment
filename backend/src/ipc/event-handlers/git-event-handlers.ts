import fs, { Dirent } from 'fs'
import path from 'path'
import * as git from 'isomorphic-git'
import { LOCAL_GIT_REPO_PATH } from '../../common/constants'
import { getRepoName } from '../../common/utils'
import { getGitHubPAT } from '../../store/githubStore'
// As per the github documentation
import http from 'isomorphic-git/http/node/index.js'
import { dialog } from 'electron'
import { getAppWindow } from '../../window'
import { writeFile } from 'fs/promises'

type DirectoryItem = {
	name: string
	isDirectory: boolean
}

type DirectoryContent = DirectoryItem[]

export const gitCloneEventHandler = async (
	event: unknown,
	args: { repoUrl: string }
) => {
	const { repoUrl } = args
	const repoName = getRepoName(repoUrl)

	try {
		// Define the target directory for the repository
		const targetPath = path.resolve(LOCAL_GIT_REPO_PATH, repoName)

		// Check if the directory already exists
		if (fs.existsSync(targetPath)) {
			if (fs.existsSync(path.join(targetPath, '.git'))) {
				return {
					success: false,
					message: `Repository already exists locally at ${targetPath}.`,
				}
			} else {
				return {
					success: false,
					message: `A folder with the name ${repoName} exists, but it is not a valid Git repository.`,
				}
			}
		}

		// Validate Git repository URL
		const gitUrlPattern =
			/^(https|git)(:\/\/|@)([^/:]+)[/:]([^/:]+)\/([^/:]+)(\.git)?$/

		if (!gitUrlPattern.test(repoUrl)) {
			return {
				success: false,
				message: 'Invalid Git repository URL.',
			}
		}

		const githubPAT = getGitHubPAT()
		if (!githubPAT) {
			return {
				success: false,
				message: 'GitHub PAT is not set.',
			}
		}

		// Ensure the target path exists
		fs.mkdirSync(targetPath, { recursive: true })

		console.log('targetPath', targetPath)
		console.log('Repo URL:', repoUrl)

		// Clone the repository using isomorphic-git
		await git.clone({
			fs,
			http,
			dir: targetPath,
			url: repoUrl,
			onAuth: () => ({
				username: 'token', // Provide a username
				password: githubPAT, // Provide the GitHub token as the password
			}),
		})

		// Verify the cloned directory contains a valid Git repository
		if (!fs.existsSync(path.join(targetPath, '.git'))) {
			return {
				success: false,
				message:
					'The cloned directory does not contain a valid Git repository.',
			}
		}

		return {
			success: true,
			message: 'Repository cloned successfully.',
		}
	} catch (error) {
		console.error('Error cloning repository:', error)
		return {
			success: false,
			message: `An error occurred during repository cloning: ${
				error instanceof Error ? error.message : String(error)
			}`,
		}
	}
}

export const getLocalRepoList = async (): Promise<string[]> => {
	try {
		const entries = await fs.promises.readdir(LOCAL_GIT_REPO_PATH, {
			withFileTypes: true,
		})

		const gitRepos = await Promise.all(
			entries
				.filter(entry => entry.isDirectory()) // Ensure it's a directory
				.map(async entry => {
					const repoPath = path.join(LOCAL_GIT_REPO_PATH, entry.name)
					const gitFolder = path.join(repoPath, '.git')
					const isGitRepo = await fs.promises
						.access(gitFolder)
						.then(() => true)
						.catch(() => false) // Check if .git folder exists
					return isGitRepo ? entry.name : null
				})
		)

		return gitRepos.filter(repo => repo !== null) as string[] // Filter out nulls
	} catch (error) {
		console.error('Error reading Git repos directory:', error)
		return []
	}
}
export const deleteRepoByName = async (
	event: Electron.IpcMainInvokeEvent,
	repoName: string
) => {
	const repoPath = path.join(LOCAL_GIT_REPO_PATH, repoName)
	try {
		await fs.promises.rm(repoPath, { recursive: true, force: true })
		return { success: true }
	} catch (error) {
		console.error('Error deleting GitRepo:', error)
		return { success: false, error: (error as Error).message }
	}
}

export const readLocalDirectory = (
	event: Electron.IpcMainInvokeEvent,
	directoryPath: string
): DirectoryContent => {
	const newDirPath = path.join(LOCAL_GIT_REPO_PATH, directoryPath)

	const directoryContents: DirectoryContent = fs
		.readdirSync(newDirPath, { withFileTypes: true })
		.map((entry: Dirent) => ({
			name: entry.name,
			isDirectory: entry.isDirectory(),
		}))

	return directoryContents
}

export const openLocalRepo = async () => {
	const mainWindow = getAppWindow()
	const result = await dialog.showOpenDialog(mainWindow!, {
		properties: ['openDirectory'],
	})

	if (result.canceled || result.filePaths.length === 0) {
		return null
	}

	return result.filePaths[0]
}

export const readFileInLocalRepo = async (
	event: Electron.IpcMainInvokeEvent,
	filePath: string
) => {
	console.log('filePath', filePath)
	const filePathInRepo = path.join(LOCAL_GIT_REPO_PATH, filePath)
	const content = fs.readFileSync(filePathInRepo, 'utf-8')
	return content
}

interface FileWriteData {
	filePath: string
	content: string
}

export const writeFileInLocalRepo = async (
	event: Electron.IpcMainInvokeEvent,
	data: FileWriteData
) => {
	const { filePath, content } = data
	const filePathInRepo = path.join(LOCAL_GIT_REPO_PATH, filePath)
	await writeFile(filePathInRepo, content, 'utf-8')
}

export const commitAndPushLocalRepo = async (
	event: Electron.IpcMainInvokeEvent,
	data: { commitMessage: string; filePath: string; repoName: string }
) => {
	try {
		const githubPAT = getGitHubPAT()
		if (!githubPAT) {
			return {
				success: false,
				message: 'GitHub PAT is not set.',
			}
		}

		const { commitMessage, filePath, repoName } = data

		const relativeFilePath = path.relative(
			LOCAL_GIT_REPO_PATH,
			path.join(LOCAL_GIT_REPO_PATH, filePath)
		)

		console.log('relativeFilePath', relativeFilePath)
		console.log('filePath', filePath)

		console.log('repoName', repoName)
		const repoFolder = path.join(LOCAL_GIT_REPO_PATH, repoName)

		// Initialize repository if not already initialized
		console.log('listFiles start')

		const isRepoInitialized = await git.listFiles({
			fs,
			dir: repoFolder,
		})
		console.log('isRepoInitialized', isRepoInitialized)
		console.log('listFiles end')

		if (isRepoInitialized.length === 0) {
			console.log('init start')

			await git.init({
				fs,
				dir: repoFolder,
			})
			console.log('init end')
			console.log('commit start')

			await git.commit({
				fs,
				dir: repoFolder,
				message: 'Initial commit',
				committer: {
					name: 'User',
					email: 'user@example.com',
				},
			})
			console.log('commit end')
		}
		console.log('currentBranch start')

		// Check current branch and create if needed
		const currentBranch = await git.currentBranch({
			fs,
			dir: repoFolder,
			fullname: false,
		})

		console.log('currentBranch end')

		if (!currentBranch) {
			console.log('branch start')

			await git.branch({
				fs,
				dir: repoFolder,
				ref: 'main',
			})
			console.log('branch end')
		}

		console.log('add start')
		const filePathInsidwWorkingDir = relativeFilePath.replace(
			`${repoName}/`,
			''
		)

		await git.add({
			fs,
			dir: repoFolder,
			filepath: filePathInsidwWorkingDir,
			force: true,
		})
		console.log('add end')

		console.log('commit start')
		await git.commit({
			fs,
			dir: repoFolder,
			message: commitMessage,
			author: {
				name: 'User',
				email: 'user@example.com',
			},
			committer: {
				name: 'User',
				email: 'user@example.com',
			},
		})
		console.log('commit end')

		console.log('push start')
		await git.push({
			fs,
			http,
			dir: repoFolder,
			remote: 'origin',
			ref: 'main',
			onAuth: () => ({
				username: 'token',
				password: githubPAT,
			}),
		})
		console.log('push end')

		return {
			success: true,
			message: 'Changes committed and pushed successfully',
		}
	} catch (error) {
		throw new Error(`Commit failed: ${error}`)
	}
}
