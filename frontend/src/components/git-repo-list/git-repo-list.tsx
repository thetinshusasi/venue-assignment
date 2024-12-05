'use client'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/joy/CircularProgress'
import Table from '@mui/joy/Table'
import Button from '@mui/joy/Button'
import styles from './git-repo-list.module.css'
import {
	DELETE_REPO_BY_NAME,
	GIT_LOCAL_REPO_LIST,
} from '../../lib/models/ipc-event-constants'

export default function RepoList() {
	const [repos, setRepos] = useState<string[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [deletingRepo, setDeletingRepo] = useState<string | null>(null)

	useEffect(() => {
		async function fetchRepos() {
			setLoading(true)
			try {
				const repoList: string[] =
					await window.electron.ipcAPI.invoke(GIT_LOCAL_REPO_LIST)
				setRepos(repoList)
			} catch (error) {
				console.error('Error fetching repos:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchRepos()
	}, [])

	const handleDelete = async (repoName: string) => {
		setDeletingRepo(repoName)
		try {
			const result = (await window.electron.ipcAPI.invoke(
				DELETE_REPO_BY_NAME,
				repoName
			)) as { success: boolean; error?: string }
			if (result.success) {
				setRepos(prevRepos => prevRepos.filter(repo => repo !== repoName))
			} else {
				console.error('Error deleting repo:', result.error)
			}
		} catch (error) {
			console.error('Error during delete operation:', error)
		} finally {
			setDeletingRepo(null)
		}
	}
	if (loading) {
		return (
			<div className={styles.loaderContainer}>
				<CircularProgress />
			</div>
		)
	}

	return (
		<div className={styles.tableContainer}>
			<Table>
				<thead>
					<tr>
						<th>Repository Name</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{repos.map(repo => (
						<tr key={repo}>
							<td>{repo}</td>
							<td>
								<Button
									variant="solid"
									color="danger"
									onClick={() => handleDelete(repo)}
									disabled={deletingRepo === repo}
								>
									{deletingRepo === repo ? 'Deleting...' : 'Delete'}
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	)
}
