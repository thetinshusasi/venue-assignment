import { exec } from 'child_process'
import axios from 'axios'
import * as fs from 'fs'

export const isGitInstalled = async (): Promise<boolean> => {
	return new Promise(resolve => {
		exec('git --version', error => {
			resolve(!error) // If no error, Git is installed
		})
	})
}

export const downloadFile = async (
	url: string,
	outputPath: string
): Promise<void> => {
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

export const getRepoName = (gitHubUrl: string): string => {
	// Remove `.git` if present at the end of the URL
	const cleanUrl = gitHubUrl.replace(/\.git$/, '')
	// Extract the last segment after the last '/'
	const repoName = cleanUrl.split('/').pop()

	// Ensure the result is not undefined
	if (!repoName) {
		throw new Error('Invalid GitHub URL')
	}

	return repoName
}
