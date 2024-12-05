'use client'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import styles from './git-repo-list.module.css'
import {
	DELETE_REPO_BY_NAME,
	GIT_LOCAL_REPO_LIST,
} from '../../lib/models/ipc-event-constants'
import { useRouter } from 'next/navigation'
import { Paper } from '@mui/material'

interface Repo {
	repoName: string
}

const paginationModel = { page: 0, pageSize: 5 }

export default function RepoList() {
	const [repos, setRepos] = useState<string[]>([])
	const [rows, setRows] = useState<Repo[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [deletingRepo, setDeletingRepo] = useState<string | null>(null)

	const router = useRouter()

	useEffect(() => {
		async function fetchRepos() {
			setLoading(true)
			try {
				const repoList: string[] =
					await window.electron.ipcAPI.invoke(GIT_LOCAL_REPO_LIST)
				const rowData = repoList.map(repoName => ({ id: repoName, repoName }))
				setRows(rowData)
				setRepos(repoList)
			} catch (error) {
				console.error('Error fetching repos:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchRepos()
	}, [])

	const handleRepoNameClick = (repoName: string) => {
		router.push(`/dashboard/${encodeURIComponent(repoName)}/viewer`)
	}

	const handleDelete = async (repoName: string) => {
		setDeletingRepo(repoName)
		try {
			const result = (await window.electron.ipcAPI.invoke(
				DELETE_REPO_BY_NAME,
				repoName
			)) as { success: boolean; error?: string }
			if (result.success) {
				setRepos(prevRepos => prevRepos.filter(repo => repo !== repoName))
				setRows(prevRows => prevRows.filter(row => row.repoName !== repoName))
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

	const columns: GridColDef[] = [
		{
			field: 'repoName',
			headerName: 'Repository Name',
			width: 200,
			renderCell: params => (
				<span
					style={{
						cursor: 'pointer',
						color: 'blue',
						textDecoration: 'underline',
					}}
					onClick={() => handleRepoNameClick(params.row.repoName)}
				>
					{params.row.repoName}
				</span>
			),
		},
		{
			field: 'actionBtn',
			headerName: 'Action',
			sortable: false,
			width: 200,
			renderCell: params => (
				<Button
					variant="contained"
					color="error"
					onClick={() => handleDelete(params.row.repoName)}
					disabled={deletingRepo === params.row.repoName}
				>
					{deletingRepo === params.row.repoName ? 'Deleting...' : 'Delete'}
				</Button>
			),
		},
	]

	return (
		<Paper sx={{ height: 400, width: '100%', margin: 'auto' }}>
			<DataGrid
				rows={rows}
				columns={columns}
				initialState={{ pagination: { paginationModel } }}
				pageSizeOptions={[5, 10]}
				checkboxSelection
				sx={{ border: 0, width: '100%' }}
			/>
		</Paper>
	)
}
