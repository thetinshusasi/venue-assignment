'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
	List,
	ListItemButton,
	Breadcrumbs,
	Link,
	Typography,
} from '@mui/material'
import { ipcRenderer } from 'electron'
import { READ_LOCAL_DIRECTORY } from '../../lib/models/ipc-event-constants'

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
		console.log('=========contents=======')
		console.log(content)
		setDirectoryContent(content)
	}

	const handleBreadcrumbClick = (index: number) => {
		const newPath = breadcrumb.slice(0, index + 1).join('/')
		setBreadcrumb(breadcrumb.slice(0, index + 1))
		loadDirectory(newPath)
	}

	const handleDoubleClick = (item: DirectoryItem) => {
		if (item.isDirectory) {
			const newPath = `${breadcrumb.join('/')}/${item.name}`
			setBreadcrumb([...breadcrumb, item.name])
			loadDirectory(newPath)
		} else {
			console.log('File clicked:', item.name)
		}
	}

	return (
		<div>
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
		</div>
	)
}

export default FileViewer
