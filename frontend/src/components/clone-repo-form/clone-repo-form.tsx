'use client'

import { useState } from 'react'
import {
	Button,
	Input,
	Typography,
	CircularProgress,
	Card,
	Box,
} from '@mui/joy'
import styles from './clone-repo-form.module.css'
import { useRouter } from 'next/navigation'

const isValidGitHubUrl = (url: string): boolean => {
	const githubUrlPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/
	return githubUrlPattern.test(url)
}

const CloneRepoForm: React.FC = () => {
	const [repoUrl, setRepoUrl] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleCloneRepo = async () => {
		if (!isValidGitHubUrl(repoUrl)) {
			setError('Invalid GitHub repository URL')
			return
		}

		setError(null)
		setLoading(true)

		// try {
		// 	const response = await window.electron.invoke('clone-repo', { repoUrl }) // Electron backend call
		// 	if (response.error) {
		// 		setError(response.error)
		// 		setLoading(false)
		// 	} else {
		// 		router.push('/dashboard/repo')
		// 	}
		// } catch (err) {
		// 	setError('An unexpected error occurred.')
		// 	setLoading(false)
		// }
	}

	return (
		<Card variant="outlined" className={styles.container}>
			<Typography level="h4">Clone GitHub Repository</Typography>
			<Box className={styles.inputContainer}>
				<Input
					placeholder="Enter GitHub repository URL"
					value={repoUrl}
					onChange={e => setRepoUrl(e.target.value)}
					size="lg"
					error={!!error}
					className={styles.inputElem}
				/>
				{error && <Typography className={styles.error}>{error}</Typography>}
				<Button
					onClick={handleCloneRepo}
					disabled={loading}
					variant="solid"
					color="primary"
					size="lg"
				>
					{loading ? <CircularProgress size="sm" /> : 'Clone Repo'}
				</Button>
			</Box>
		</Card>
	)
}

export default CloneRepoForm
