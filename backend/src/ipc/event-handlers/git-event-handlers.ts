import fs from 'fs'
import path from 'path'
import * as git from 'isomorphic-git'
import { LOCAL_GIT_REPO_PATH } from '../../common/constants'
import { getRepoName } from '../../common/utils'
import { getGitHubPAT } from '../../store/githubStore'
// As per the github documentation
import http from 'isomorphic-git/http/node/index.js'

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
