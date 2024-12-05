'use client'

import { useState } from 'react'
import {
	Card,
	Typography,
	TextField,
	Button,
	Box,
	CircularProgress,
} from '@mui/material'
import styles from './clone-repo-form.module.css'
import { useRouter } from 'next/navigation'
import { GIT_CLONE_EVENT } from '../../lib/models/ipc-event-constants'
import { useSession } from 'next-auth/react'

const isValidGitHubUrl = (url: string): boolean => {
	const githubUrlPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/
	return githubUrlPattern.test(url)
}

const CloneRepoForm: React.FC = () => {
	const [repoUrl, setRepoUrl] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [responseMessage, setResponseMessage] = useState<string | null>(null)
	const router = useRouter()
	const { data: session } = useSession()

	console.log('=======session')
	console.log(session)

	const handleCloneRepo = async () => {
		if (!isValidGitHubUrl(repoUrl)) {
			setError('Invalid GitHub repository URL')
			return
		}

		setError(null)
		setLoading(true)
		setResponseMessage(null)

		try {
			if (window.electron) {
				const token = session?.accessToken
				if (!token) {
					setError('GitHub token is not available. Please log in.')
					setLoading(false)
					return
				}

				// Call the GIT_CLONE_EVENT
				const response: { success: boolean; message?: string } =
					await window.electron.ipcAPI.invoke(GIT_CLONE_EVENT, {
						repoUrl,
						token,
					})

				// Handle the response
				if (response.success) {
					setResponseMessage(response.message)
					alert('Repo Cloning complete')
					router.push('/dashboard/repository')
				} else {
					setError(response.message || 'Failed to clone the repository.')
				}
			} else {
				setError('Electron API is not available.')
			}
		} catch (err) {
			setError('An unexpected error occurred.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Card variant="outlined" className={styles.container}>
			<Typography variant="h4" gutterBottom>
				Clone GitHub Repository
			</Typography>
			<Box className={styles.inputContainer}>
				<TextField
					placeholder="Enter GitHub repository URL"
					value={repoUrl}
					onChange={e => setRepoUrl(e.target.value)}
					error={!!error}
					helperText={error}
					variant="outlined"
					fullWidth
					className={styles.inputElem}
				/>
				<Button
					onClick={handleCloneRepo}
					disabled={loading}
					variant="contained"
					color="primary"
					size="large"
				>
					{loading ? <CircularProgress size={24} /> : 'Clone Repo'}
				</Button>
			</Box>
			{responseMessage && (
				<Box className={styles.responseContainer}>
					<Typography className={styles.responseMessage}>
						Response: {responseMessage}
					</Typography>
				</Box>
			)}
		</Card>
	)
}

export default CloneRepoForm
