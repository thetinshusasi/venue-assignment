'use client'
import { useState, useEffect, useRef } from 'react'
import {
	List,
	ListItemButton,
	Breadcrumbs,
	Link,
	Typography,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material'
import MonacoEditor from '@monaco-editor/react'
import styles from './file-viewer.module.css'
import {
	COMMIT_FILE_IN_LOCAL_REPO,
	READ_FILE_IN_LOCAL_REPO,
	READ_LOCAL_DIRECTORY,
	WRITE_FILE_IN_LOCAL_REPO,
} from '../../lib/models/ipc-event-constants'

type DirectoryItem = {
	name: string
	isDirectory: boolean
}

type FileViewProps = {
	repoName: string
}

const FileViewer = ({ repoName }: FileViewProps) => {
	const [directoryContent, setDirectoryContent] = useState<DirectoryItem[]>([])
	const [breadcrumb, setBreadcrumb] = useState<string[]>([repoName as string])
	const [selectedFile, setSelectedFile] = useState<string | null>(null)
	const [fileContent, setFileContent] = useState<string>('')
	const [commitDialogOpen, setCommitDialogOpen] = useState<boolean>(false)
	const [commitMessage, setCommitMessage] = useState<string>('')
	const monacoRef = useRef(null)

	useEffect(() => {
		if (repoName) {
			loadDirectory(repoName as string)
		}
	}, [repoName])

	const loadDirectory = async (directoryPath: string) => {
		const content: DirectoryItem[] = await window.electron.ipcAPI.invoke(
			READ_LOCAL_DIRECTORY,
			directoryPath
		)
		setDirectoryContent(content)
		setSelectedFile(null)
		setFileContent('')
	}

	const handleBreadcrumbClick = async (index: number) => {
		const newBreadcrumb = breadcrumb.slice(0, index + 1)
		const clickedItem = newBreadcrumb[newBreadcrumb.length - 1]

		// Check if the clicked item is a file by looking at the directoryContent
		const isFile = directoryContent.find(
			item => item.name === clickedItem && !item.isDirectory
		)

		if (isFile) {
			const filePath = newBreadcrumb.join('/')
			const content = (await window.electron.ipcAPI.invoke(
				READ_FILE_IN_LOCAL_REPO,
				filePath
			)) as string
			setSelectedFile(filePath)
			setFileContent(content)
		} else {
			const newPath = newBreadcrumb.join('/')
			setBreadcrumb(newBreadcrumb)
			loadDirectory(newPath)
		}
	}

	const handleDoubleClick = async (item: DirectoryItem) => {
		if (item.isDirectory) {
			const newPath = `${breadcrumb.join('/')}/${item.name}`
			setBreadcrumb([...breadcrumb, item.name])
			loadDirectory(newPath)
		} else {
			const filePath = `${breadcrumb.join('/')}/${item.name}`
			const content = (await window.electron.ipcAPI.invoke(
				READ_FILE_IN_LOCAL_REPO,
				filePath
			)) as any
			const newPath = `${breadcrumb.join('/')}/${item.name}`
			setBreadcrumb([...breadcrumb, item.name])
			setSelectedFile(filePath)
			setFileContent(content)
		}
	}

	const handleCommitClick = () => {
		setCommitDialogOpen(true)
	}

	const handleCommitConfirm = async () => {
		if (selectedFile && fileContent) {
			console.log('fileContent', fileContent)
			const contentToWrite = String(fileContent)

			await window.electron.ipcAPI.invoke(WRITE_FILE_IN_LOCAL_REPO, {
				filePath: selectedFile,
				content: contentToWrite,
			})
			await window.electron.ipcAPI.invoke(COMMIT_FILE_IN_LOCAL_REPO, {
				commitMessage,
				filePath: selectedFile,
				repoName,
			})
			setCommitDialogOpen(false)
			setSelectedFile(null)

			// Get the parent directory path by removing the filename from breadcrumb
			const parentBreadcrumb = breadcrumb.slice(0, -1)
			setBreadcrumb(parentBreadcrumb)
			loadDirectory(parentBreadcrumb.join('/'))
		}
	}

	const handleCommitCancel = () => {
		setCommitDialogOpen(false)
	}

	const handleCancelClick = async () => {
		if (selectedFile) {
			await window.electron.ipcAPI
				.invoke(READ_FILE_IN_LOCAL_REPO, selectedFile)
				.then((content: string) => {
					setFileContent(content)
				})
		}
	}

	return (
		<div className={styles.container}>
			<Breadcrumbs aria-label="breadcrumb">
				{breadcrumb.map((crumb, index) => (
					<Link
						key={index}
						color={index === breadcrumb.length - 1 ? 'text.primary' : 'inherit'}
						onClick={() => handleBreadcrumbClick(index)}
					>
						{crumb}
					</Link>
				))}
			</Breadcrumbs>
			{!selectedFile && (
				<List>
					{directoryContent.map(item => (
						<ListItemButton
							key={item.name}
							onDoubleClick={() => handleDoubleClick(item)}
						>
							{item.name}
						</ListItemButton>
					))}
				</List>
			)}
			{selectedFile && (
				<div>
					<MonacoEditor
						height="600px"
						defaultLanguage="javascript"
						value={fileContent}
						onChange={value => setFileContent(value || '')}
					/>
					<Button
						variant="contained"
						color="primary"
						onClick={handleCommitClick}
					>
						Commit
					</Button>
					<Button
						variant="contained"
						color="secondary"
						onClick={handleCancelClick}
					>
						Cancel
					</Button>
				</div>
			)}
			<Dialog open={commitDialogOpen} onClose={handleCommitCancel}>
				<DialogTitle>Commit Changes</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Commit Message"
						fullWidth
						variant="standard"
						value={commitMessage}
						onChange={e => setCommitMessage(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCommitCancel} color="primary">
						Cancel
					</Button>
					<Button onClick={handleCommitConfirm} color="primary">
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default FileViewer
